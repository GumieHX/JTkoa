const order_routers = require('koa-router')();
const MySqlDaoService = require('../sql/mysql');
const Common = require('../common/common');
const Format = require('../common/format');
const uuid = require('uuid');

order_routers.post('/getOrderList.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();

    let res = await ds.sqlQuery('SELECT * FROM order_table where user_id = \'' + data.user_id + '\'');
    ctx.body = Common.selectResMethod(res, 'Success', 'Not Found Order Message With This UserId');
});

order_routers.post('/getOrderDetails.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();

    let res = await ds.sqlQuery('SELECT * FROM order_table where user_id = \'' + data.user_id + '\' and order_no = \'' + data.order_no + '\'');
    ctx.body = Common.selectResMethod(res, 'Success', 'Not Found Order Message With This UserId And OrderNum');
});


order_routers.post('/getOrderInfo.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();

    let order_no = uuid.v1();
    let now = Format.dateFormate();

    let res = await ds.sqlQuery('SELECT * FROM car_carpark_table where plate_no = \'' + data.plate_no + '\'');
    if (Common.resHasErr(res)) {
        ctx.body = Common.resHasErr(res);
        return;
    }
    if (res.length == 0) {
        ctx.body = {
            code: '500',
            msg: '车辆不在场内',
        };
        return;
    };
    let order_res = await ds.sqlQuery('SELECT * FROM order_table where user_id = \'' + data.user_id + '\' and plate_no = \'' + data.plate_no + '\' and car_park_id = \'' + res[0].car_park_id + '\'');
    if (Common.resHasErr(order_res)) {
        ctx.body = Common.resHasErr(order_res);
        return;
    }

    let tag = false;
    let num_tag = '';
    for (let i = 0; i < order_res.length; i++) {
        if (order_res[i].order_status == '0') {
            tag = true;
            num_tag = i;
        }
    };

    if (tag) {

        let order_msg = await ds.sqlQuery('SELECT * FROM order_table where order_no = \'' + order_res[num_tag].order_no + '\'');
        if (Common.resHasErr(order_msg)) {
            ctx.body = Common.resHasErr(order_msg);
            return;
        }
        let car_park_msg = await ds.sqlQuery('SELECT * FROM car_park_table where car_park_id = \'' + res[0].car_park_id + '\'');
        if (Common.resHasErr(car_park_msg)) {
            ctx.body = Common.resHasErr(car_park_msg);
            return;
        }
        let discount_msg = await ds.sqlQuery('SELECT * FROM discount_table where discount_code = \'' + order_msg[0].discount_code + '\'');
        if (Common.resHasErr(discount_msg)) {
            ctx.body = Common.resHasErr(discount_msg);
            return;
        }

        ctx.body = Common.hadOrderInfo(res, order_msg, car_park_msg, discount_msg, now);

    } else {

        let inse_res = await ds.sqlIncrease('INSERT INTO order_table (order_no,car_park_id,car_park_name,plate_no,user_id,order_status,create_datetime,pay_amount,discount_value,operate_status) VALUE ("' + order_no + '","' + res[0].car_park_id + '","' + res[0].car_park_name + '","' + data.plate_no + '","' + data.user_id + '","0","' + now + '","0","0","0")');
        if (inse_res.code && inse_res.code == '200') {
            let car_park_msg = await ds.sqlQuery('SELECT * FROM car_park_table where car_park_id = \'' + res[0].car_park_id + '\'');
            if (Common.resHasErr(car_park_msg)) {
                ctx.body = Common.resHasErr(car_park_msg);
                return;
            }
            ctx.body = Common.notHadOrderInfo(order_no, now, res, data, car_park_msg);
        } else {
            ctx.body = {
                code: '500',
                msg: inse_res,
            }
        }
    }
});

order_routers.post('/sendPayment.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();
    let now = Format.dateFormate();

    let res = await ds.sqlNotQuery('UPDATE order_table set payment_channel = \'微信支付\' , order_status = \'2\' , payment_datetime = \'' + now + '\' , pay_amount = \'' + data.received_amount + '\' , discount_code = \'' + data.discount_code + '\' , discount_value = \'' + data.discount_value + '\' where order_no = \'' + data.order_no + '\'');
    if (res.constructor != Object) {
        ctx.body = {
            code: '500',
            msg: res,
        }
        return;
    }
    let car_carpark_res = await ds.sqlQuery('SELECT * FROM car_carpark_table where plate_no = \'' + data.plate_no + '\'');
    if (Common.resHasErr(car_carpark_res)) {
        ctx.body = Common.resHasErr(car_carpark_res);
        return;
    }
    
    let amount = car_carpark_res[0].received_amount;
    amount = Number(amount) + Number(data.should_pay);

    let carpark_res = await ds.sqlNotQuery('UPDATE car_carpark_table set received_amount = \'' + amount + '\' where  plate_no = \'' + data.plate_no + '\'');
    if (carpark_res.constructor != Object) {
        ctx.body = {
            code: '500',
            msg: res,
        }
        return;
    }

    let discount_res = await ds.sqlNotQuery('UPDATE discount_table set discount_status = \'1\' where discount_code = \'' + data.discount_code + '\'');
    ctx.body = discount_res.constructor != Object ? {
        code: '500',
        msg: res,
    } : discount_res;

});

module.exports = order_routers;