const appoinment_router = require('koa-router')();
const MySqlDaoService = require('../sql/mysql');
const Common = require('../common/common');
const uuid = require('uuid');

appoinment_router.post('/sendAppoinment.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();
    let appo_id = uuid.v1();

    let res = await ds.sqlIncrease('INSERT INTO appo_table (user_id,plate_no,car_park_id,phone_number,appo_date,appo_time,appo_id,appo_status,car_park_name) VALUE ("' + data.user_id + '","' + data.plate_no + '","' + data.car_park_id + '","' + data.phone_number + '","' + data.appo_date + '","' + data.appo_time + '","' + appo_id + '","' + data.appo_status + '","' + data.car_park_name + '")');
    if (res.constructor == Object) {
        res.data = {
            appo_id: appo_id
        }
    }
    ctx.body = Common.InorUpdateResMethod(res);
});

appoinment_router.post('/getAppoinmentDetails.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();

    let res = await ds.sqlQuery('SELECT * FROM appo_table where user_id = \'' + data.user_id + '\' and appo_id = \'' + data.appo_id + '\'');
    let park_msg_res = '';
    if (res.constructor == Array && res.length != 0) {
        park_msg_res = await ds.sqlQuery('SELECT * FROM car_park_table where car_park_id = \'' + res[0].car_park_id + '\'');
    }
    ctx.body = Common.CascadeQueryResMethod(res, park_msg_res);
});

appoinment_router.post('/cancelAppoinment.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();

    let res = await ds.sqlNotQuery('UPDATE appo_table set appo_status = \'2\' where user_id = \'' + data.user_id + '\' and appo_id = \'' + data.appo_id + '\'');
    ctx.body = Common.InorUpdateResMethod(res);
});

appoinment_router.post('/getAppoinmentList.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();

    let res = await ds.sqlQuery('SELECT * FROM appo_table where user_id = \'' + data.user_id + '\'');
    ctx.body = Common.selectResMethod(res, 'Success', 'Not Found Appoinment Message With This UserId');
});

module.exports = appoinment_router;