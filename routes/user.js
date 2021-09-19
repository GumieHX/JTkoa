const user_router = require('koa-router')();
const MySqlDaoService = require('../sql/mysql');
const Common = require('../common/common');

user_router.post('/getUserPlate.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();

    let res = await ds.sqlQuery('SELECT * FROM bind_plateNo_table where user_id = \'' + data.user_id + '\' and plate_no <> ""');
    ctx.body = Common.selectResMethod(res, 'Success', 'Not Found PlateNo With This UserId');
});

user_router.post('/addUserPlate.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();
    let res = '';

    let user_res = await ds.sqlQuery('SELECT * FROM bind_plateNo_table where user_id = \'' + data.user_id + '\'');
    if (user_res == 0) {
        res = await ds.sqlIncrease('INSERT INTO bind_plateNo_table (user_id,plate_no) VALUE ("' + data.user_id + '","' + data.plate_no + '")');
    } else {
        res = await ds.sqlNotQuery('UPDATE bind_plateNo_table set plate_no = \'' + data.plate_no + '\'  where user_id = \'' + data.user_id + '\'');
    }

    ctx.body = Common.InorUpdateResMethod(res);
});

user_router.post('/getUserInfo.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();

    let res = await ds.sqlQuery('SELECT * FROM user_table where user_id = \'' + data.user_id + '\'');
    ctx.body = Common.selectResMethod(res, 'Success', 'Not Found UserInfo With This UserId');
});

user_router.post('/setUserInfo.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();
    let res = '';

    let user_res = await ds.sqlQuery('SELECT * FROM user_table where user_id = \'' + data.user_id + '\'');
    if (user_res == 0) {
        res = await ds.sqlIncrease('INSERT INTO user_table (user_id,birthday,personal_sign) VALUE ("' + data.user_id + '","' + data.birthday + '","' + data.personal_sign + '")');
    } else {
        res = await ds.sqlNotQuery('UPDATE user_table set birthday = \'' + data.birthday + '\' , personal_sign = \'' + data.personal_sign + '\'  where user_id = \'' + data.user_id + '\'');
    }

    ctx.body = Common.InorUpdateResMethod(res);
});

user_router.post('/getUserPhoneNumber.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();

    let res = await ds.sqlQuery('SELECT phone_number FROM user_table where user_id = \'' + data.user_id + '\'');
    ctx.body = Common.selectResMethod(res, 'Success', 'Not Found UserPhoneNum With This UserId');
});

user_router.post('/serUserNumber.do', async (ctx, next) => {
    let data = ctx.request.body;
    let ds = new MySqlDaoService();

    let res = await ds.sqlNotQuery('UPDATE user_table set phone_number = \'' + data.phone_number + '\' where  user_id = \'' + data.user_id + '\'');
    ctx.body = Common.InorUpdateResMethod(res);
});


module.exports = user_router;




