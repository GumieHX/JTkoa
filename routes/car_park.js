const carpark_router = require('koa-router')();
const MySqlDaoService = require('../sql/mysql');
const Common = require('../common/common');
const Format = require('../common/format');

carpark_router.post('/getCarParkMsg.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();

    let res = await ds.sqlQuery('SELECT * FROM car_park_table where car_park_id = \'' + data.car_park_id + '\'');
    ctx.body = Common.selectResMethod(res, 'Success', 'Not Found CarParkMsg With This CarParkId');
});

carpark_router.post('/getCarParkList.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();

    let res = await ds.sqlQuery('SELECT * FROM car_park_table');
    ctx.body = Common.selectResMethod(Format.carParkListFormat(res), 'Success', 'Not Found CarParkMsg With This CarParkId');
});

carpark_router.post('/searchCarParkList.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();

    let res = await ds.sqlQuery('SELECT * FROM car_park_table where car_park_name LIKE \'%' + data.car_park_name + '%\'');
    ctx.body = Common.selectResMethod(Format.carParkListFormat(res), 'Success', 'Not Found CarParkMsg With This CarParkName');
});

carpark_router.post('/getNearCarParkList.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();

    let res = await ds.sqlQuery('SELECT * FROM car_park_table');
    ctx.body = Common.selectResMethod(Format.nearParkListFormat(res,data.longitude,data.latitude), 'Success', 'Not Found Nearly CarPark');
});

module.exports = carpark_router;