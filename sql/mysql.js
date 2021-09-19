const mysql = require("mysql");
const {
    mysqlConfig
} = require("./mysql.config");

//封装数据库DAO层 
class MySqlDaoService {
    constructor() {
        //this.connection = mysql.createConnection(mysqlConfig);
        this.poor = mysql.createPool(mysqlConfig);
    };

    // 执行查询操作
    // param : sqlstring
    sqlQuery(sqlstring) {
        //返回一个Pomise
        return new Promise((resolve, reject) => {
            // 连接数据库
            this.poor.getConnection((err, connection) => {
                if (err) {
                    reject(err.message);
                } else {
                    connection.query(sqlstring, (err, res) => {
                        if (err) {
                            reject(err.message);
                        } else {
                            // 将结果转成一个对象返回
                            let result = [];

                            res.forEach(item => {
                                let obj = {};

                                for (let name in item) {
                                    obj[name] = item[name];
                                }

                                result.push(obj);
                            });

                            resolve(result);
                        }
                    })
                }
                connection.release();
            })
        })
    };
    // 封装删除操作
    // param : sqlstring
    sqlDelete(sqlstring) {
        return new Promise((resolve, reject) => {
            this.poor.getConnection((err, connection) => {
                if (err) {
                    reject(err.message);
                } else {
                    connection.query(sqlstring, (err, res) => {
                        if (err) {
                            reject(err.message);
                        } else {
                            let result = {
                                code: "200",
                                msg: "Delete Data Success"
                            };
                            resolve(result);
                        }
                    })
                }
                connection.release();
            })
        })
    };
    // 封装新增操作
    // param : sqlstring
    sqlIncrease(sqlstring) {
        return new Promise((resolve, reject) => {

            this.poor.getConnection((err, connection) => {
                if (err) {
                    reject(err.message);
                } else {
                    connection.query(sqlstring, (err, res) => {
                        if (err) {
                            reject(err.message);
                        } else {
                            let result = {
                                code: "200",
                                msg: "Increase Data Success"
                            };
                            resolve(result);
                        }
                    })
                }
                connection.release();
            })
        })
    };
    // 执行非查询操作
    // param : sqlstring
    sqlNotQuery(sqlstring) {
        //返回一个Pomise
        return new Promise((resolve, reject) => {
            this.poor.getConnection((err, connection) => {
                if (err) {
                    reject(err.message);
                } else {
                    connection.query(sqlstring, (err, res) => {
                        if (err) {
                            reject(err.message);
                        } else {
                            let result = {
                                code: "200",
                                msg: "success"
                            };
                            resolve(result);
                        }
                    })
                }
                connection.release();
            })
        })
    }
}


//导出模块
module.exports = MySqlDaoService;