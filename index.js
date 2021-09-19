const Koa = require('koa');
const Common = require('./common/common');
const bodyParser = require('koa-bodyparser')();
// port
const port = 8899;
// route group
const route_array = [require('./routes/main'), require('./routes/user'), require('./routes/car_park'), require('./routes/appoinment'), require('./routes/order')];

const app = new Koa();

app.use(bodyParser);

Common.bindRouteArr(app, route_array);

app.listen(port, () => {
    console.log('The serve is running at port ' + port);
})