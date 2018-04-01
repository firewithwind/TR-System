
const Koa = require('koa')
const static = require('koa-static')

let app = new Koa();

app.use(async (ctx, next) => {
    console.log(ctx.url)
    await next()
})

app.use(static(__dirname, 'static'))

app.listen(3001)
