const koa = require('koa');
const koaBody = require('koa-body')
const ws = require('socket.io')
const mysql = require('mysql')
const config = require('./config')
const path = require('path')
const jwt = require('jsonwebtoken')
const jwtKoa = require('koa-jwt')
const util = require('util')
const verify = util.promisify(jwt.verify)
const static = require('koa-static')
const { uploadFile } = require('./uploadFile.js')
const fs = require('fs')
const qs = require('querystring')
const { createPersonReim, createFinanceReim } = require('./utils/index.js')
const secret = `hitwh`
let spEnum = {}

const app = new koa();

var connection = mysql.createConnection(config);

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

const fileType = [
    'css',
    'less',
    'gif',
    'html',
    'ico',
    'jpeg',
    'jpg',
    'js',
    'json',
    'pdf',
    'png',
    'svg',
    'swf',
    'tiff',
    'txt',
    'wav',
    'wma',
    'wmv',
    'xml',
    'xlsx',
    'xls',
    'doc',
    'docx',
]

app.use(koaBody())
app.use(jwtKoa({secret}).unless({
    path: [/\/login/, /\/register/, /^[\/]?$/, /^\/manage[/]?$/, /\/static/] //数组中的路径不需要通过jwt验证
}))
app.use(async(ctx, next) => {
    let param = ctx.request.body
    let select = null,
        result = null,
        token = null
    let extendName = ctx.url.split('.').slice(-1)[0]
    // 验证获取token信息
    if (fileType.indexOf(extendName) !== -1) {
        await next()
    } else {
        let tokenResult
        let reqToken = ctx.header.authorization && ctx.header.authorization.split(' ')[1]
        if (!!reqToken) {
            tokenResult = await verify(reqToken, secret)
        }
        switch (true) {
            case /^[\/]?[index]?[\/]?$/.test(ctx.url):
                ctx.url = `/static/dist/index.html`
                await next()
                break
            case /^\/manage/.test(ctx.url):
                ctx.url = '/static/manage/index.html'
                await next()
                break
            case /\/login/.test(ctx.url):
                if (!param.id || !param.pwd) {
                    ctx.throw(400, '密码错误')
                } else {
                        select = `select id, name, phone, Email, level, avatar, laboratory
                        from user where id = "${param.id}" or phone = "${param.id}" and pwd = "${param.pwd}"`
                        result = await querySQL(select)
                        if (!result.state) {
                            ctx.throw(400, result.msg)
                        } else {
                            let userToken = {...result.body[0]}
                            if (!result.body[0]) {
                                ctx.throw(400, '登入失败，请检查用户名和密码')
                            }
                            token = jwt.sign(userToken, secret, {expiresIn: '10h'})
                            ctx.body = {
                                result: result.body[0],
                                token
                            }
                        }
                }
                break
            case /\/logout/.test(ctx.url):
                if (!!tokenResult.id) {
                    if(!!io.sockets.connected[spEnum[tokenResult.id]]) {
                        try {
                            io.sockets.connected[spEnum[tokenResult.id]].disconnect(true)
                        } catch(e) {

                        }
                        delete spEnum[tokenResult.id]
                    }
                    ctx.body = 'success'
                } else {
                    ctx.throw(400, 'Not Found')
                }
                break
            case /\/register/.test(ctx.url):
                if (!param.id||!param.pwd||!param.name||!param.phone||!param.laboratory) {
                    ctx.throw(400, 'bad register information')
                } else {
                    select = `insert into user
                            values("${param.id}", "${param.name}", "${param.phone}", "${param.Email}", 0, "${param.pwd}", "/static/avatar/timg.jpeg", "${param.laboratory}", "${param.jobTitle}", NULL)`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = {
                            type: 0,
                            msg: 'success'
                        }
                    } else {
                        ctx.throw(500, result.msg)
                    }
                }
                break
            case /\/getUserInfor/.test(ctx.url):
                if (!!tokenResult.id) {
                    select = `select id, name, phone, Email, level, avatar, laboratory
                        from user where id = "${tokenResult.id}"`
                    result = await querySQL(select)
                    if (!!result.state) {
                        if (tokenResult.level === result.body[0].level) {
                            ctx.body = result.body[0]
                        } else {
                            let newToken = jwt.sign({...result.body[0]}, secret, {expiresIn: '10h'})
                            ctx.body = {
                                ...result.body[0],
                                token: newToken
                            }
                        }
                    } else {
                        ctx.throw(400, result.msg)
                    }
                } else {
                    ctx.throw(400, 'bad userID in request');
                }
                break
            case /\/getMessage/.test(ctx.url):
                if (!!tokenResult.id) {
                    select = `select * from message where uid = "${tokenResult.id}" order by occurTime desc limit ${param.offset}, ${param.limit}`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = result.body
                    } else {
                        ctx.throw(400, result.msg)
                    }
                } else {
                    ctx.throw(400, 'Not Found')
                }
                break
            case /\/getAnnouncement/.test(ctx.url):
                select = `select count(*) from announcement`
                var total = await querySQL(select)
                if (!total.state) {
                    ctx.throw(400, 'Not Found')
                }
                select = `select * from announcement order by occurTime desc limit ${param.offset}, ${param.limit}`
                result = await querySQL(select)
                if (!!result.state) {
                    ctx.body = {
                        data: result.body,
                        total: total.body[0]['count(*)']
                    }
                } else {
                    ctx.throw(400, 'Not Found')
                }
                break
            case /\/getQuestionDetail/.test(ctx.url):
                if (!!param.id) {
                    select = `select * from question where id = ${param.id}`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = result.body[0]
                    } else {
                        ctx.throw(400, 'Not Found')
                    }
                } else {
                    ctx.throw(400, '参数错误')
                }
                break
            case /\/getQuestion$/.test(ctx.url):
                select = `select count(*) from question`
                var total = await querySQL(select)
                if (!total.state) {
                    ctx.throw(400, 'Not Found')
                }
                select = `select id, title, occurTime from question order by occurTime desc limit ${param.offset}, ${param.limit}`
                result = await querySQL(select)
                if (!!result.state) {
                    ctx.body = {
                        data: result.body,
                        total: total.body[0]['count(*)']
                    }
                } else {
                    ctx.throw(400, 'Not Found')
                }
                break
            case /\/getPolicys/.test(ctx.url):
                if (tokenResult.level >= 2) {

                    select = `select count(*) from policy limit ${param.offset}, ${param.limit}`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = {
                            total: result.body[0]['count(*)']
                        }
                    } else {
                        ctx.throw(400, '获取信息总数失败')
                    }
                    select = `select id, title, occurTime from policy order by occurTime desc limit ${param.offset}, ${param.limit}`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body.result = result.body
                    } else {
                        ctx.throw(400, '获取信息列表失败')
                    }
                } else {
                    ctx.throw(400, '权限错误')
                }
                break
            case /\/getPolicyFiles/.test(ctx.url):
                select = `select * from policyFile where policy = ${param.id}`
                result = await querySQL(select)
                if (!!result.state) {
                    ctx.body = result.body
                } else {
                    ctx.throw(400, '获取信息失败')
                }
                break
            case /\/deletePolicyFile/.test(ctx.url):
                if (tokenResult.level >= 2) {
                    fs.unlink(path.resolve(__dirname, `static/${param.url.split('static/')[1]}`), (err) => {
                        console.log(err)
                    })
                    select = `delete from policyFile where id = ${param.id}`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = 'success'
                    } else {
                        ctx.throw(400, '删除失败')
                    }
                } else {
                    ctx.throw(400, '权限错误')
                }
                break
            case /\/getPolicyDetail/.test(ctx.url):
                if (!!param.id) {
                    select = `select * from policy where id = ${param.id}`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = result.body[0]
                    } else {
                        ctx.throw(400, 'Not Found')
                    }
                } else {
                    ctx.throw(400, '参数错误')
                }
                break
            case /\/uploadPolicyFile/.test(ctx.url):
                var serverFilePath = path.join( __dirname, 'static/policy')
                // 上传文件事件
                result = await uploadFile( ctx, {
                    fileType: 'album',
                    path: serverFilePath
                }, 'policy')
                if (!!result.data.fileUrl) {
                    var query = qs.parse(ctx.url.split('?')[1])
                    select = `insert into policyFile values(NULL, "http://${ctx.host}/static/${result.data.fileUrl}", "${query.id}")`
                    result.data.create = await querySQL(select)
                    if (!!result.data.create.state) {
                        ctx.body = {
                            id: result.data.create.body.insertId,
                            url: `http://${ctx.host}/static/${result.data.fileUrl}`
                        }
                    } else {
                        fs.unlink(path.resolve(__dirname, 'static/' + result.data.fileUrl), (err) => {
                            console.log(err)
                        })
                        ctx.throw(400, result.body.create.msg)
                    }
                } else {
                    ctx.throw(500, '上传失败')
                }
                break
            case /\/insertPolicy/.test(ctx.url):
                if (tokenResult.level >= 2) {
                    var time = Date.now()
                    select = `insert into policy
                            values(NULL, "${param.title}", "${time}", '${param.data}')`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = {
                            ...param,
                            id: result.body.insertId,
                            occurTime: time
                        }
                    } else {
                        ctx.throw(400, '创建失败')
                    }
                } else {
                    ctx.throw(400, '权限错误')
                }
                break
            case /\/deletePolicy/.test(ctx.url):
                if (tokenResult.level >= 2) {
                    select = `delete from policy where id = ${param.id}`
                    result = await querySQL(select)
                    if (!!result.state) {
                        select = `select url from policyFile where policy = ${param.id}`
                        result = await querySQL(select)
                        if (!!result.state) {
                            result.body.forEach(item => {
                                fs.unlink(path.resolve(__dirname, 'static/' + item.url.split('static/')[1]), err => {
                                    console.log(err)
                                })
                            })
                            select = `delete from policyFile where policy = ${param.id}`
                            querySQL(select)
                        }
                        ctx.body = 'success'
                    } else {
                        ctx.throw(400, '删除失败')
                    }
                } else {
                    ctx.throw(400, '权限错误')
                }
                break
            case /\/updatePolicy/.test(ctx.url):
                if (tokenResult.level >= 2) {
                    select = `update policy set data = '${param.data}', title = "${param.title}" where id = ${param.id}`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = 'success'
                    } else {
                        ctx.throw(400, '更新失败')
                    }
                } else {
                    ctx.throw(400, '权限错误')
                }
                break
            case /\/getPolicy$/.test(ctx.url):
                select = `select count(*) from policy`
                var total = await querySQL(select)
                if (!total.state) {
                    ctx.throw(400, 'Not Found')
                }
                select = `select id, title, occurTime from policy order by occurTime desc limit ${param.offset}, ${param.limit}`
                result = await querySQL(select)
                if (!!result.state) {
                    ctx.body = {
                        data: result.body,
                        total: total.body[0]['count(*)']
                    }
                } else {
                    ctx.throw(400, '获取信息失败')
                }
                break
            case /\/readMessage/.test(ctx.url):
                if (param.uid === tokenResult.id) {
                    select = `update message set state = 1 where id = ${param.id}`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = 'success'
                    } else {
                        ctx.throw(500, result.msg)
                    }
                } else {
                    ctx.throw(400, 'Not Found')
                }
                break
            case /\/updateUserInfor/.test(ctx.url):
                if (tokenResult.id === param.id) {
                    select = `update user
                            set name = "${param.name}",
                                phone = "${param.phone}",
                                Email = "${param.Email}",
                                laboratory = "${param.laboratory}"`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = {
                            msg: 'success'
                        }
                    } else {
                        ctx.throw(400, 'update filed')
                    }
                } else {
                    ctx.throw(400, 'you can not update others information')
                }
                break
            case /\/addProject/.test(ctx.url):
                if (tokenResult.level >= 2) {
                    if (!param.title || !param.funding || !param.description || !param.overflow) {
                        ctx.throw(400, '参数错误')
                    }
                    let time = Date.now()
                    select = [`insert into project
                            values(NULL, "${param.title}", ${param.funding}, "${param.description}", 0, "${time}", 0, ${param.overflow})`,
                            `insert into announcement values(NULL, '项目通知', '<b>${param.name}</b>创建了名为<b>${param.title}</b>的项目', '${time}', '/project')`]
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = 'success'
                    } else {
                        ctx.throw(400, '添加失败')
                    }
                } else {
                    ctx.throw(400, '没有权限')
                }
                break
            case /\/updateProject/.test(ctx.url):
                select = `update project set description = "${param.description}", funding = ${param.funding}, overflow = ${param.overflow} where id = ${param.id}`
                result = await querySQL(select)
                if (!!result.state) {
                    ctx.body = 'success'
                } else {
                    ctx.throw(400, '更新失败')
                }
                break
            case /\/uploadUserAvatar/.test(ctx.url):
                var serverFilePath = path.join( __dirname, 'static/avatar')
                // 上传文件事件
                result = await uploadFile( ctx, {
                    fileType: 'album',
                    path: serverFilePath
                }, 'avatar')
                if (!!result.data.fileUrl) {
                    select = `update user set avatar = "http://${ctx.host}/static/${result.data.fileUrl}" where id = "${tokenResult.id}"`
                    result.data.create = await querySQL(select)
                    if (!!result.data.create.state) {
                        // 删除原头像
                        if (!!tokenResult.avatar) {
                            if (tokenResult.avatar !== '/static/avatar/timg.jpeg') {
                                fs.unlink(path.resolve(__dirname, 'static/' + tokenResult.avatar.split('static/')[1]), (err) => {
                                    console.log(err)
                                })
                            }
                        }
                        ctx.body = {
                            url: `http://${ctx.host}/static/${result.data.fileUrl}`
                        }
                    } else {
                        try {
                            fs.unlink(path.resolve(__dirname, 'static/' + result.data.fileUrl), (err) => {
                                console.log(err)
                            })
                        } catch(e) {
                            console.log(e)
                        }
                        ctx.throw(400, result.body.create.msg)
                    }
                } else {
                    ctx.throw(500, 'can not upload the picture')
                }
                break
            case /\/updatePersonLevel/.test(ctx.url):
                if (tokenResult.level >= 2) {
                    if (param.level !== '' && !!param.id) {
                        select = `update user set level = ${param.level} where id = "${param.id}"`
                        result = await querySQL(select)
                        if (!!result.state) {
                            ctx.body = 'success'
                            // if (io.sockets.connected[spEnum[param.requester]]) {
                            //     io.sockets.connected[spEnum[param.requester]].send(JSON.stringify(message))
                            // }
                        } else {
                            ctx.throw(400, '修改失败')
                        }
                    } else {
                        ctx.throw(400, '参数错误')
                    }
                } else {
                    ctx.throw(400, '没有权限')
                }
                break
            case /\/getFindPersons/.test(ctx.url):
                if (tokenResult.level >= 2) {
                    select = `select * from user where`
                    if (!!param.trans.id) {
                        select += ` id = "${param.trans.id}" and `
                    }
                    if (!!param.trans.name) {
                        select += ` name = "${param.trans.name}" and `
                    }
                    if (!!param.trans.jobTitle) {
                        select += ` jobTitle = "${param.trans.jobTitle}" and `
                    }
                    if (param.trans.level !== '') {
                        select += ` level = "${param.trans.level}" and `
                    }
                    select = select.slice(0, -5)
                    select += ` limit ${param.limit.offset}, ${param.limit.count}`
                    var total = await querySQL(select.replace('*', 'count(*)'))
                    if (!!total.state) {
                        total = total.body[0]['count(*)']
                    } else {
                        ctx.throw(400, '查询失败')
                    }
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = {
                            total: total,
                            result: result.body
                        }
                    } else {
                        ctx.throw(400, '查询失败')
                    }
                } else {
                    ctx.throw(400, '权限错误')
                }
                break
            case /\/getProjects/.test(ctx.url):
                if (!!tokenResult.id) {
                    select = `select *
                            from project`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = result.body
                    } else {
                        ctx.throw(500, 'a error occured in server')
                    }
                } else {
                    ctx.throw(400, 'bad user ID in param')
                }
                break
            case /\/getFindProjects/.test(ctx.url):
                var step = 0
                select = `select * from project
                        where`
                if (!!param.query.id) {
                    select += ` id = "${param.query.id}" and `
                }
                if (!!param.query.occurTime) {
                    select += ` occurTime > "${param.query.occurTime}" and `
                }
                if (!!param.query.title) {
                    select += ` title = "${param.query.title}" `
                    step = 1
                }
                if (step === 0) {
                    select = select.slice(0, -5)
                }
                select += ` order by occurTime desc `
                var total = await querySQL(select.replace('*', 'count(*)'))
                if (!total.state) {
                    ctx.throw(400, total.msg)
                }
                select += `limit ${param.limit.offset}, ${param.limit.limit}`
                result = await querySQL(select)
                if (!!result.state) {
                    ctx.body = {
                        total: total.body[0]['count(*)'],
                        result: result.body
                    }
                } else {
                    ctx.throw(400, result.msg)
                }
                break
            case /\/createRequestion/.test(ctx.url):
                if (!param.user) {
                    ctx.throw(400, 'bad request body of user')
                } else if (!param.startTime) {
                    ctx.throw(400, 'bad request body of startTime')
                } else if (!param.endTime) {
                    ctx.throw(400, 'bad request body of endTime')
                } else if (!param.way) {
                    ctx.throw(400, 'bad request body of way')
                } else if (!param.destination) {
                    ctx.throw(400, 'bad request body of destination')
                } else {
                    select = 'insert into requestion values(NULL, 1,' +
                        param.project + ',"' +
                        param.user + '","' +
                        Date.now() + '","' +
                        param.startTime + '","' +
                        param.endTime + '",' +
                        param.way + ',"' +
                        param.destination + '","' +
                        param.description + '", NULL, NULL, NULL)'
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = {
                            id: result.body.insertId
                        }
                    } else {
                        ctx.throw(400, result.msg)
                    }
                }
                break
            case /\/getRequestionDetail/.test(ctx.url):
                if (!!param.id) {
                    select = `select u.name, u.level, r.*, p.title, p.funding, p.overhead, p.alloverhead, p.overflow
                            from user u join requestion r on r.requester = u.id right join project p on r.project = p.id
                            where r.id=${param.id}`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = result.body[0]
                    } else {
                        ctx.throw(400, result.msg)
                    }
                } else {
                    ctx.throw(400, 'bad requestion ID in request');
                }
                break
            case /\/getUndoneRequestion/.test(ctx.url):
                if (!!tokenResult.id) {
                    select = `select r.*, p.title
                            from requestion r join project p on r.project = p.id
                            where r.requester="${tokenResult.id}" and r.state<2`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = result.body
                    } else {
                        ctx.throw(400, result.msg)
                    }
                } else {
                    ctx.throw(400, 'bad userID in request');
                }
                break
            case /\/getUndoneReimbursement/.test(ctx.url):
                if (!!tokenResult.id) {
                    select = `select r.*, p.title
                            from requestion r join project p on r.project = p.id
                            where r.requester="${tokenResult.id}" and r.state>=3 and r.state<5`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = result.body
                    } else {
                        ctx.throw(400, result.msg)
                    }
                } else {
                    ctx.throw(400, 'bad userID in request');
                }
                break
            case /\/getUnremarkRequestion/.test(ctx.url):
                if (!!tokenResult.id) {
                    var level = tokenResult.level
                    if (level == 1) {
                        select = `select r.*, u.name, u.level, p.title
                                from user u right join requestion r on r.requester=u.id
                                right join project p on r.project = p.id
                                where state < 2`
                        result = await querySQL(select)
                        if (!!result.state) {
                            ctx.body = result.body
                        } else {
                            ctx.body = result.msg
                        }
                    } else if (level == 2) {
                        select = `select r.*, u.name, u.level, p.title
                                from user u right join requestion r on r.requester=u.id
                                right join project p on r.project = p.id
                                where state > 2 and state < 5`
                        result = await querySQL(select)
                        if (!!result.state) {
                            ctx.body = result.body
                        } else {
                            ctx.throw(400, result.msg)
                        }
                    } else {
                        ctx.throw(400, 'you have no acception for remarking')
                    }
                } else {
                    ctx.throw(400, 'bad userID in request');
                }
                break
            case /\/deleteRequestion/.test(ctx.url):
                if (!!param.id) {
                    if (tokenResult.level >= 3) {
                        select = `delete
                                from requestion
                                where id = ${param.id}`
                    } else {
                        select = `delete
                                from requestion
                                where id=${param.id} and requester="${tokenResult.id}"`
                    }
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = {
                            type: 0,
                            msg: 'success'
                        }
                    } else {
                        ctx.throw(400, result.msg)
                    }
                } else {
                    ctx.throw(400, 'bad params in request')
                }
                break
            case /\/approveRequestion/.test(ctx.url):
                if (!!param.id) {
                    select = `select level from user where id="${param.uid}"`
                    var queryRes = await querySQL(select)
                    if (!!queryRes.state) {
                        var level = queryRes.body[0].level
                    } else {
                        ext.throw(400, 'no this user')
                    }
                    if (level === 1 && param.state < 2) {
                        var time = Date.now()
                        if (param.operate === 0) {
                            select = `update requestion
                                    set state=state+1, approver="${param.uid}", changeTime="${time}" where id=${param.id}`,
                            result = await querySQL(select)
                            if (!!result.state) {
                                select = `insert into message values(NULL, "${param.requester}", "您的描述为<b>${param.description}</b>的申请已被审批，审批人id为<b>${param.uid}</b>", 0, "${time}", "审核通知")`
                                result = await querySQL(select)
                                if (!!result.state) {
                                    var messageDate = `您的描述为<b>${param.description}</b>的申请已被审批，审批人id为<b>${param.uid}</b>`
                                    var message = {
                                        id: result.body.insertId,
                                        uid: param.requester,
                                        data: messageDate,
                                        state: 0,
                                        occurTime: time
                                    }
                                    if (io.sockets.connected[spEnum[param.requester]]) {
                                        io.sockets.connected[spEnum[param.requester]].send(JSON.stringify(message))
                                    }
                                    ctx.body = {
                                        type: 0,
                                        msg: 'success'
                                    }
                                } else {
                                    ctx.throw(400, result.msg)
                                }
                            } else {
                                ctx.throw(400, result.msg)
                            }
                        } else {
                            select = `insert into message values(NULL, "${param.requester}", "您的描述为<b>${param.description}</b>的申请被驳回，原因为<b>${param.reason}</b>,<br/>审批人id: <b>${param.uid}</b>,请撤销后重新提交申请", 0, ${time}, "审核通知")`
                            result = await querySQL(select)
                            if (!!result.state) {
                                var messageDate = `您的描述为<b>${param.description}</b>的申请被驳回，原因为<b>${param.reason}</b>,<br/>审批人id: <b>${param.uid}</b>,请撤销后重新提交申请`
                                var message = {
                                    id: result.body.insertId,
                                    uid: param.requester,
                                    data: messageDate,
                                    state: 0,
                                    occurTime: time
                                }
                                if (io.sockets.connected[spEnum[param.requester]]) {
                                    io.sockets.connected[spEnum[param.requester]].send(JSON.stringify(message))
                                }
                                ctx.body = {
                                    type: 0,
                                    msg: 'success'
                                }
                            } else {
                                ctx.throw(400, result.msg)
                            }
                        }
                    } else if (level === 2 && param.state >= 3 && param.state < 4) {
                        var time = Date.now()
                        if (param.operate === 0) {
                            select = [`update requestion
                                    set state=state+1, reimer="${param.uid}", changeTime="${time}", project=${param.project} where id=${param.id}`,
                                    `update project set overhead = overhead + ${param.acountMoney[0]}
                                    where id = ${param.project}`,
                                    `update project set overhead = overhead + ${param.acountMoney[1]}
                                    where id = ${param.project2}`]
                            if (param.oldProject !== param.project) {
                                select.push(
                                            `update reimbursement set project = ${param.project} where requestion = ${param.id} and type != 34`,
                                            `update project set alloverhead = alloverhead - ${param.acountMoney[0]} where id = ${param.oldProject}`,
                                            `update project set alloverhead = alloverhead + ${param.acountMoney[0]} where id = ${param.project}`)
                            }
                            if (param.oldProject !== param.project2) {
                                select.push(
                                            `update reimbursement set project = ${param.project2} where requestion = ${param.id} and type = 34`,
                                            `update project set alloverhead = alloverhead - ${param.acountMoney[1]} where id = ${param.oldProject}`,
                                            `update project set alloverhead = alloverhead + ${param.acountMoney[1]} where id = ${param.project2}`)
                            }
                            result = await querySQL(select)
                            if (!!result.state) {
                                select = `insert into message values(NULL, "${param.requester}", "您的描述为${param.description}的申请已被审批，审批人id为${param.uid}", 0, "${time}", "审核通知")`
                                result = await querySQL(select)
                                if (!!result.state) {
                                    var messageDate = `您的描述为<b>${param.description}</b>的申请已被审批，审批人id为${param.uid}`
                                    var message = {
                                        id: result.body.insertId,
                                        uid: param.requester,
                                        data: messageDate,
                                        state: 0,
                                        occurTime: time
                                    }
                                    if (io.sockets.connected[spEnum[param.requester]]) {
                                        io.sockets.connected[spEnum[param.requester]].send(JSON.stringify(message))
                                    }
                                    ctx.body = {
                                        type: 0,
                                        msg: 'success'
                                    }
                                } else {
                                    ctx.throw(400, result.msg)
                                }
                            } else {
                                ctx.throw(400, result.msg)
                            }
                        } else {
                            select = `insert into message values(NULL, "${param.requester}", "您的描述为<b>${param.description}</b>的申请报销被驳回，原因为<b>${param.reason}</b>,请修改<br/>审批人id: <b>${param.uid}</b>", 0, ${time}, "审核通知")`
                            result = await querySQL(select)
                            if (!!result.state) {
                                var messageDate = `您的描述为<b>${param.description}</b>的申请报销被驳回，原因为<b>${param.reason}</b>,请修改<br/>审批人id: <b>${param.uid}</b>`
                                var message = {
                                    id: result.body.insertId,
                                    uid: param.requester,
                                    data: messageDate,
                                    state: 0,
                                    occurTime: time
                                }
                                if (io.sockets.connected[spEnum[param.requester]]) {
                                    io.sockets.connected[spEnum[param.requester]].send(JSON.stringify(message))
                                }
                                ctx.body = {
                                    type: 0,
                                    msg: 'success'
                                }
                            } else {
                                ctx.throw(400, result.msg)
                            }
                        }
                    } else if (level === 2 && param.state === 4) {
                        if (param.operate === 0) {
                            var time = Date.now()
                            select = `update requestion
                                    set state=state+1, approver="${param.uid}", changeTime="${time}" where id=${param.id}`
                            result = await querySQL(select)
                            if (!!result.state) {
                                select = `insert into message values(NULL, "${param.requester}", "您的描述为${param.description}的申请已被审批，审批人id为${param.uid}", 0, "${time}", "审核通知")`
                                result = await querySQL(select)
                                if (!!result.state) {
                                    var messageDate = `您的描述为<b>${param.description}</b>的申请已完成`
                                    var message = {
                                        id: result.body.insertId,
                                        uid: param.requester,
                                        data: messageDate,
                                        state: 0,
                                        occurTime: time
                                    }
                                    if (io.sockets.connected[spEnum[param.requester]]) {
                                        io.sockets.connected[spEnum[param.requester]].send(JSON.stringify(message))
                                    }
                                    ctx.body = {
                                        type: 0,
                                        msg: 'success'
                                    }
                                } else {
                                    ctx.throw(400, result.msg)
                                }
                            } else {
                                ctx.throw(400, result.msg)
                            }
                        }
                    } else {
                        ctx.throw(400, 'you have no acception for remarking')
                    }
                } else {
                    etx.throw(400, 'bad param in requestion')
                }
                break
            case /\/addReimbursement/.test(ctx.url):
                if (!!param.requestion && !isNaN(+param.money)) {
                    let seat
                    if (!!param.seat) {
                        seat = `"${param.seat}"`
                    } else {
                        seat = null
                    }
                    select = [`insert
                            into reimbursement
                            values(NULL,
                            ${param.requestion},
                            ${param.type},
                            "${Date.now()}",
                            ${param.money},
                            "${param.startAddress}",
                            "${param.startDate}",
                            "${param.startTime}",
                            "${param.endAddress}",
                            "${param.endDate}",
                            "${param.endTime}",
                            ${seat},
                            "${param.desc}",
                            NULL, NULL, "${param.note}",${param.project}
                            )`,
                            `update requestion set state=3 where id=${param.requestion}`,
                            `update project set alloverhead = alloverhead + ${param.money}
                            where id in (select project from requestion where id = ${param.requestion})`]
                    result =await querySQL(select)
                    if (!!result.state) {
                        ctx.body = {
                            id: result.body[0].body.insertId
                        }
                    } else {
                        ctx.throw(400, '添加失败，请检查参数')
                    }
                } else {
                    ctx.throw(400, '参数错误')
                }
                break
            case /\/getReimbursements/.test(ctx.url):
                if (!!param.id) {
                    select = `select r.*, p.id as pid, p.title from reimbursement r join project p on r.project = p.id where requestion=${param.id}`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = result.body
                    } else {
                        ctx.throw(400, result.msg)
                    }
                } else {
                    ctx.throw(400, 'bad requestion id in param')
                }
                break
            case /\/getCreatableReim/.test(ctx.url):
                if (!!tokenResult.id) {
                    select = `select u.name, u.level, r.*, p.title, p.funding, p.overhead, p.alloverhead, p.overflow
                            from user u join requestion r on r.requester = u.id right join project p on r.project = p.id
                            where r.requester="${tokenResult.id}" and state>=2 and state <3`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = result.body
                    } else {
                        ctx.throw(400, result.msg)
                    }
                } else {
                    ctx.throw(400, 'bad userID in param')
                }
                break
            case /\/getFindRequestion/.test(ctx.url):
                let limit = param.limit
                let user = param.user
                let key = 0
                select = `select r.*, u.name, u.level, p.title
                from user u right join requestion r on r.requester=u.id
                right join project p on r.project = p.id where `
                if (!!param.id) {
                    select += `r.id=${param.id} and`
                    key = 1
                }
                if (!!param.name) {
                    select += ` (u.id="${param.name}" or u.name="${param.name}") and`
                    key = 1
                }
                if (!!param.state) {
                    select += ` r.state=${param.state} and`
                    key = 1
                }
                if (!!param.project) {
                    select += ` r.project=${param.project} and`
                    key = 1
                }
                if (!!param.startDate) {
                    select += ` occurTime >= "${param.startDate}" and occurTime <= "${param.endDate}" and`
                    key = 1
                }
                if (!key) {
                    select += `r.requester="${user}"`
                } else {
                    select = select.slice(0, -4)
                }
                let sitem = await querySQL(select.replace('r.*, u.name, u.level, p.title', 'count(*)'))
                select += ` order by r.occurTime desc limit ${limit.offset}, ${limit.count}`
                result = await querySQL(select)
                if (!!sitem.state && !!result.state) {
                    ctx.body = {
                        results: result.body,
                        acount: sitem.body[0] ? sitem.body[0]['count(*)'] : 0
                    }
                } else {
                    ctx.throw(400, result.msg)
                }
                break
            case /\/deleteReim/.test(ctx.url):
                if (!!param.id) {
                    select = [
                        `delete from reimbursement where id = ${param.id}`,
                        `update project set alloverhead = alloverhead - ${param.money} where id = ${param.project}`]
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = {
                            type: 1,
                            msg: 'success'
                        }
                    } else {
                        ctx.throw(400, result.msg)
                    }
                } else {
                    ctx.throw(400, 'bad reimbursement id in param')
                }
                break
            case /\/uploadInvoice\?requestion=[/m/M]*/.test(ctx.url):
                var serverFilePath = path.join( __dirname, 'static/invoice')
                // 上传文件事件
                var query = qs.parse(ctx.url.split('?')[1])
                if (!!query.requestion) {
                    result = await uploadFile( ctx, {
                        fileType: 'album',
                        path: serverFilePath
                    }, 'invoice')
                    if (!!result.data.fileUrl) {
                        select = `insert into invoice values(NULL, ${query.requestion}, "http://${ctx.host}/static/${result.data.fileUrl}", "${Date.now()}")`
                        result.data.create = await querySQL(select)
                        if (!!result.data.create.state) {
                            ctx.body = {
                                id: result.data.create.body.insertId,
                                url: `http://${ctx.host}/static/${result.data.fileUrl}`
                            }
                        } else {
                            try {
                                fs.unlink(path.resolve(__dirname, 'static/' + result.data.fileUrl), (err) => {
                                    console.log(err)
                                })
                            } catch(e) {
                                console.log(e)
                            }
                            ctx.throw(400, result.body.create.msg)
                        }
                    } else {
                        ctx.throw(500, 'can not upload the picture')
                    }
                } else {
                    ctx.throw(400, 'bad requestion id in param')
                }
                break
            case /\/getInvoices/.test(ctx.url):
                if (!!param.requestion) {
                    select = `select * from invoice where requestion=${param.requestion}`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = result.body
                    } else {
                        ctx.throw(400, result.msg)
                    }
                } else {
                    ctx.throw(400, 'bad requestion id in param')
                }
                break
            case /\/deleteInvoice/.test(ctx.url):
                if (!!param.id) {
                    let _savePath = path.resolve(__dirname, 'static/', param.url.split('static/')[1])
                    try {
                        fs.unlink(_savePath, (err) => {
                            if (err) {
                                ctx.throw(400, 'can not delete the file')
                            }
                        })
                    } catch(e) {
                        console.log(e)
                    }
                    select = `delete from invoice where id=${param.id}`
                    result = await querySQL(select)
                    if (!!result.state) {
                        ctx.body = {
                            type: 1,
                            message: 'success'
                        }
                    } else {
                        ctx.throw(400, result.msg)
                    }
                }
                break
            case /\/getStatisticDate/.test(ctx.url):
                select = `select reim.*, req.id as rid, req.state, pro.id as pid, pro.title, u.name
                            from requestion req right join reimbursement reim on req.id = reim.requestion
                            right join project pro on pro.id = reim.project
                            right join user u on req.requester = u.id
                            where`
                if (!!param.id) {
                    select += ` u.id = "${param.id}" and`
                }
                if (!!param.project) {
                    select += ` pro.id = ${param.project} and`
                }
                if (!!param.laboratory) {
                    select += ` u.laboratory = "${param.laboratory}" and`
                }
                if (!!param.start && !!param.end) {
                    select += ` reim.startDate >= ${param.start} and reim.endDate <= ${param.end}`
                } else {
                    ctx.throw(400, 'bad params for search')
                }
                result = await querySQL(select)
                if (!!result.state) {
                    ctx.body = result.body
                } else {
                    ctx.throw(500, result.msg)
                }
                break
            case /\/exportReim/.test(ctx.url):
                if (param.id) {
                    select = [
                        `select r.*, u.name, u.laboratory from requestion r join user u on u.id = r.requester where r.id = ${param.id}`,
                        `select * from reimbursement where requestion = ${param.id}`
                    ]
                    result = await querySQL(select)
                    if (!!result.state) {
                        try {
                            let filePath = createPersonReim(result.body[1].body, undefined, result.body[0].body[0])
                            ctx.body = `http://${ctx.host}${filePath}`
                        } catch(e) {
                            ctx.throw(500, 'can not export the .xlsx file')
                        }

                    } else {
                        ctx.throw(400, result[0].msg || result[1].msg)
                    }
                } else {
                    ctx.throw(400, '参数错误')
                }
                break
            case /\/exportFinanceReim/.test(ctx.url):
                if (!!param.id) {
                    select = [
                        `select r.*, u.name, u.laboratory, u2.name as approverName, u3.name as reimerName from
                        requestion r right join user u on u.id = r.requester
                        right join user u2 on r.approver = u2.id
                        right join user u3 on r.reimer = u3.id
                        where r.id = ${param.id}`,
                        `select * from reimbursement where requestion = ${param.id}`
                    ]
                    result = await querySQL(select)
                    if (!!result.state) {
                        try {
                            let filePath = createFinanceReim(result.body[1].body, undefined, result.body[0].body[0])
                            ctx.body = `http://${ctx.host}${filePath}`
                        } catch(e) {
                            ctx.throw(500, 'can not export the .xlsx file')
                        }

                    } else {
                        ctx.throw(400, result.msg)
                    }
                } else {
                    ctx.throw(400, '参数错误')
                }
                break
            default:
                ctx.throw(400, 'Not Found')
        }
    }
})

app.use(static(__dirname, 'static'))

let server = app.listen(3000, () => {
    console.log('server listening 3000...')
})

let io = ws(server)

io.on('connection', (socket) => {
    spEnum[socket.handshake.query.token] = socket.id
    socket.on('error', (error) => {
        console.log(error)
    })
    socket.on('reconnect', (socket) => {
        console.log('one connect has been reconnected')
    })
    socket.on('disconnect', (reason) => {
        console.log('one connection has been discart')
    })
})

// 执行查询函数
function querySQL(select) {
    if (!Array.isArray(select)) {
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
    } else {
        return new Promise((resolve, rej) => {
            let results = new Array(select.length).fill(0)
            connection.beginTransaction(function(err) {
                if (err) {
                    rej({
                        state: 0,
                        msg: err
                    })
                }
                select.forEach((item, index) => {
                    querySQL(item)
                        .then((res) => {
                            results[index] = res
                            if (results.indexOf(0)===-1) {
                                connection.commit(function(err) {
                                    if (err) {
                                        connection.rollback(function() {
                                            rej({
                                                state: 0,
                                                msg: err
                                            })
                                        });
                                    }
                                    resolve({
                                        state: 1,
                                        body: results
                                    })
                                });
                            }
                        }, (err) => {
                            console.log('running sql error')
                            connection.rollback(function() {
                                rej({
                                    state: 0,
                                    msg: err
                                })
                            })
                        })
                })
            });
        })
    }
}
