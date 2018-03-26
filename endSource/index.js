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

app.use(async (ctx) => {
    let param = ctx.request.body
    let select = null,
        result = null
    switch(ctx.url) {
        case '/getUserInfor':
            if (!!param.id) {
                select = 'select * from user where id = ' + param.id
                result = await querySQL(select)
                if(!!result.state) {
                    ctx.body = result.body[0]
                } else {
                    ctx.body = result.msg
                }
            } else {
                ctx.throw(400, 'bad userID in request');
            }
            break
        case '/createRequestion':
            if (!param.user) {
                ctx.throw(400, 'bad request body of user')
            } else if (!param.startTime) {
                ctx.throw(400, 'bad request body of startTime')
            } else if (!param.endTime) {
                ctx.throw(400, 'bad request body of endTime')
            } else if (!param.requester) {
                ctx.throw(400, 'bad request body of endTime')
            } else if (!param.way) {
                ctx.throw(400, 'bad request body of way')
            } else if (!param.destination) {
                ctx.throw(400, 'bad request body of destination')
            } else {
                select = 'insert into requestion values(NULL, 1,'
                    + param.project + ',"'
                    + param.requester + '","'
                    + Date.now() + '","'
                    + param.startTime + '","'
                    + param.endTime + '",'
                    + param.way + ',"'
                    + param.destination + '","'
                    + param.description + '", NULL, NULL)'
                result = await querySQL(select)
                if(!!result.state) {
                    ctx.body = {
                        id: result.body.insertId
                    }
                } else {
                    ctx.body = result.msg
                }
            }
            break
        case '/getRequestionDetail':
            if (!!param.id) {
                select = `select *
                        from user u join requestion r on r.requester = u.id
                        where r.id=${param.id}`
                result = await querySQL(select)
                if(!!result.state) {
                    ctx.body = result.body[0]
                } else {
                    ctx.body = result.msg
                }
            } else {
                ctx.throw(400, 'bad requestion ID in request');
            }
            break
        case '/getUndoneRequestion':
            if (!!param.id) {
                select = `select *
                        from requestion
                        where requester=${param.id} and state<4`
                result = await querySQL(select)
                if(!!result.state) {
                    ctx.body = result.body
                } else {
                    ctx.body = result.msg
                }
            } else {
                ctx.throw(400, 'bad userID in request');
            }
            break
        case '/getUnremarkRequestion':
            if (!!param.id) {
                select = `select level
                        from user
                        where id=${param.id}`
                var queryRes = await querySQL(select)
                if(!!queryRes.state) {
                    var level = queryRes.body[0].level
                } else {
                    ctx.throw(400, 'no this user')
                }
                if(level == 1) {
                    select = `select *
                            from user u join requestion r on r.requester=u.id
                            where state < 2`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = result.body
                    } else {
                        ctx.body = result.msg
                    }
                } else if (level == 2) {
                    select = `select *
                            from user u join requestion r on r.requester=u.id
                            where state > 2 and state < 4`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = result.body
                    } else {
                        ctx.body = result.msg
                    }
                } else {
                    ctx.throw(400, 'you have no acception for remarking')
                }
            } else {
                ctx.throw(400, 'bad userID in request');
            }
            break
        case '/deleteRequestion':
            if(param.id && param.uid) {
                select = `delete
                        from requestion
                        where id=${param.id} and requester=${param.uid}`
                result = await querySQL(select)
                if (!!result.state) {
                    ctx.body = {
                        type: 0,
                        msg: 'success'
                    }
                } else {
                    ctx.body =result.msg
                }
            } else {
                ctx.throw(400, 'bad params in request');
            }
            break
        default:
            ctx.throw(400, 'Not Found')
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
