const jwt = require('jsonwebtoken')
const Koa = require('koa')
const verify = require('util').promisify(jwt.verify)
console.log(verify)

const app = new Koa()


