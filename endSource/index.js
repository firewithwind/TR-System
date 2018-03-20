const koa = require('koa');
const koaBody = require('koa-body')
const mysql = require('mysql')
const config = require('./config')

const app = new koa();

var connection = mysql.createConnection(config);

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

app.use(koaBody())

app.use(async (ctx, next) => {
    if('/getUserInfor' === ctx.url) {
        await next()
    }
})

app.use(async (ctx) => {
    let param = ctx.request.body
    if(!!param.id) {
        let select = 'select * from user where id = ' + param.id
        let result = await querySQL(select)
        if(!!result.state) {
            ctx.body = result.body[0]
        } else {
            ctx.body = result.msg
        }
    } else {
        ctx.throw(400, 'bad userID in request');
    }
})

function querySQL(select) {
    return new Promise((res, rej) => {
        connection.query(select, function(error, results, fields) {
            if (error) {
                rej({
                    state: 0,
                    msg: error
                })
            } else {
                res({
                    state: 1,
                    body: results
                })
            }
        })
    })
}

app.listen(3000)
