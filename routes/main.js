const main_router = require('koa-router')();

main_router.get('/',async (ctx, next) => {
    ctx.body = 'hello world';
    next();
});

main_router.get('/user', async (ctx, next) => {
    ctx.body = 'user page';
    next();
});


module.exports = main_router;