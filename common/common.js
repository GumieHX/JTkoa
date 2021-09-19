let Format = require('./format');

let Common = {
    // 绑定路由方法
    bindRouteArr: (app, routeArr) => {
        for (let i = 0; i < routeArr.length; i++) {
            app.use(routeArr[i].routes(), routeArr[i].allowedMethods);
        };

        console.log('bind routeArr is finished!');
    },
    // 处理select方法的返回
    selectResMethod: (res, sucMsg, falMsg) => {
        let obj = {
            code: res.constructor == Array && res.length != 0 ? '200' : '500',
        };
        if (res.constructor != Array) {
            obj.msg = res;
        } else {
            if (res.length != 0) {
                obj.msg = sucMsg;
                obj.data = res;
            } else {
                obj.msg = falMsg;
            }
        }
        return obj;
    },
    // 处理insecse和update方法的返回
    InorUpdateResMethod: (res) => {
        let obj = {};
        if (res.constructor != Object) {
            obj.code = '500';
            obj.msg = res;
        } else {
            obj = res;
        }
        return obj;
    },
    // 处理存在级联的query的返回
    CascadeQueryResMethod: (appoRes, carParkRes) => {
        if (appoRes.constructor == Array && carParkRes.constructor == Array) {
            return {
                code: '200',
                msg: 'Success',
                data: {
                    appo_id: appoRes[0].appo_id,
                    user_id: appoRes[0].user_id,
                    plate_no: appoRes[0].plate_no,
                    car_park_id: appoRes[0].car_park_id,
                    phone_number: appoRes[0].phone_number,
                    appo_datetime: appoRes[0].appo_date + ' ' + appoRes.appo_time,
                    appo_status: appoRes[0].appo_status,
                    car_park_name: carParkRes[0].car_park_name,
                    car_park_img: carParkRes[0].car_park_img
                }
            }
        }

        if (appoRes.constructor == Array && appoRes.length == 0) {
            return {
                code: '500',
                msg: "Not Found Appoiment Data With This Condition"
            }
        }

        return {
            code: '500',
            msg: appoRes.constructor == Array ? carParkRes : appoRes
        };
    },
    resHasErr: (res) => {
        if (res.constructor != Array) {
            return {
                code: '500',
                msg: res,
            }
        }

        return false;
    },
    hadOrderInfo: (res, order_msg, car_park_msg, discount_msg,now) => {

        let money_datetime = Format.receiveAmountFormat(res[0].enter_datetime, now);
        var parking_datetime = Format.dayTimeFormat(res[0].enter_datetime, now);
        let charge_ruls = car_park_msg[0].charge_ruls;
        let amount = money_datetime * charge_ruls;


        return {
            code: '200',
            msg: 'Success',
            data: {
                order_no: order_msg[0].order_no,
                car_park_id: order_msg[0].car_park_id,
                car_park_name: order_msg[0].car_park_name,
                plate_no: order_msg[0].plate_no,
                user_id: order_msg[0].user_id,
                order_status: order_msg[0].order_status,
                create_datetime: order_msg[0].create_datetime,
                pay_amount: order_msg[0].pay_amount,
                enter_datetime: res[0].enter_datetime,
                received_amount: res[0].received_amount,
                receive_amount: amount + '',
                parking_datetime: parking_datetime,
                discountArr: discount_msg
            }
        }
    },
    notHadOrderInfo: (order_no, now, res, data, car_park_msg) => {
        let enter_datetime = res[0].enter_datetime;
        let money_datetime = Format.receiveAmountFormat(enter_datetime, now);
        let parking_datetime = Format.dayTimeFormat(enter_datetime, now);

        let charge_ruls = car_park_msg[0].charge_ruls;
        let amount = money_datetime * charge_ruls;

        return {
            code: '200',
            msg: 'Success',
            'data': {
                order_no: order_no,
                car_park_id: res[0].car_park_id,
                car_park_name: res[0].car_park_name,
                plate_no: data.plate_no,
                user_id: data.user_id,
                order_status: '0',
                create_datetime: now,
                pay_amount: '0',
                enter_datetime: res[0].enter_datetime,
                received_amount: res[0].received_amount,
                receive_amount: amount + '',
                parking_datetime: parking_datetime,
                discountArr: []
            }
        };

    }

};



module.exports = Common;