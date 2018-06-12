<template>
    <div class="login">
        <div v-if="login" class="wrapper form-wrapper">
            <p class="title">实验室差旅报销系统</p>
            <div class="input-wrapper">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xingmingyonghumingnicheng"></use>
                </svg>
                <input v-model="loginInfor.id" type="text" placeholder="输入用户名/手机号">
            </div>
            <div class="input-wrapper">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-icon-"></use>
                </svg>
                <input v-model="loginInfor.pwd" type="password" placeholder="输入密码" @keydown.enter="handlelogin">
            </div>
            <div class="help">
                <el-checkbox v-model="checked" class="check">记住密码</el-checkbox>
                <span class="forget">忘记密码？</span>
            </div>
            <div class="submit">
                <el-button @click="handlelogin">登入</el-button>
            </div>
            <div class="register">
                <span>还没有账号?</span>
                <span class="content" @click="login=false">注册</span>
            </div>
        </div>
        <div v-else class="wrapper register-wrapper">
            <span class="goback" @click="login=true">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-fanhui"></use>
                </svg>
            </span>
            <span>注册</span>
            <div class="input-wrapper">
                <span class="label">用户名</span>
                <input v-model="registerInfor.id" placeholder="输入用户名" @input="checkInputID">
            </div>
            <div class="input-wrapper">
                <span class="label">密码</span>
                <input v-model="registerInfor.pwd" type="password" placeholder="输入密码">
            </div>
            <div class="input-wrapper">
                <span class="label">确认</span>
                <input v-model="registerInfor.confirm" type="password" placeholder="再次输入密码">
            </div>
            <div class="input-wrapper">
                <span class="label">姓名</span>
                <input v-model="registerInfor.name" placeholder="输入真实姓名">
            </div>
            <div class="input-wrapper">
                <span class="label">职称</span>
                <input v-model="registerInfor.jobTitle" placeholder="输入职称">
            </div>
            <div class="input-wrapper">
                <span class="label">手机</span>
                <input v-model="registerInfor.phone" placeholder="输入手机号码" @input="checkInputPhone">
            </div>
            <div class="input-wrapper">
                <span class="label">邮箱</span>
                <input v-model="registerInfor.Email" placeholder="输入邮箱地址">
            </div>
            <div class="input-wrapper">
                <span class="label">研究室</span>
                <input v-model="registerInfor.laboratory" placeholder="输入所在研究室">
            </div>
            <div class="submit" @click="register">
                <el-button>注册</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import {createSocket, query, md} from '@/utils'
export default {
    data() {
        return {
            login: true,
            checked: false,
            registerInfor: {
                laboratory: '',
                id: '',
                pwd: '',
                confirm: '',
                name: '',
                phone: '',
                Email: '',
                jobTitle: ''
            },
            loginInfor: {
                id: '',
                pwd: ''
            },
            param: {}
        }
    },
    created() {
        this.param = query(location.href.split('?')[1])
    },
    mounted() {
        let users = localStorage.getItem('users')
        if (!!users) {
            this.checked = true
            users = JSON.parse(users)
            this.loginInfor = users
        }
    },
    methods: {
        checkInputID(input) {
            let pattrn = /[0-9a-zA-Z_]/g
            if (!pattrn.test(input.data)) {
                this.registerInfor.id = this.registerInfor.id.slice(0, -1)
            }
        },
        checkInputPhone(input) {
            let pattrn = /[0-9]/g
            if (input.data && !pattrn.test(input.data) || this.registerInfor.phone.length > 11) {
                this.registerInfor.phone = this.registerInfor.phone.slice(0, -1)
            }
        },
        handlelogin() {
            if (!this.loginInfor.id) {
                this.$message('请输入用户名')
            } else if (!this.loginInfor.pwd) {
                this.$message('密码错误')
            } else {
                this.$request
                    .post('/test/login')
                    .send({
                        ...this.loginInfor,
                        pwd: md(this.loginInfor.pwd)
                    })
                    .end((err, res) => {
                        if (!!err) {
                            this.$message({
                                type: 'error',
                                message: err.status + ': ' + err.response.text
                            })
                        } else {
                            if (this.checked) {
                                localStorage.setItem('localInfor', {
                                    id: this.loginInfor.id,
                                    pwd: this.loginInfor.pwd,
                                    checked: true
                                })
                            }
                            let socket = createSocket(`${location.origin}`, {token: res.body.result.id})
                            socket.on('message', (data) => {
                                let message = JSON.parse(data)
                                this.$notify.info({
                                    title: '通知',
                                    dangerouslyUseHTMLString: true,
                                    message: message.data,
                                    duration: 6000
                                })
                            })
                            if (this.checked) {
                                let users = {
                                    id: this.loginInfor.id,
                                    pwd: this.loginInfor.pwd
                                }
                                localStorage.setItem('users', JSON.stringify(users))
                            } else {
                                localStorage.setItem('users', '')
                            }
                            this.$store.commit('setSocket', socket)
                            this.$store.commit('setUser', res.body.result)
                            this.$store.commit('setToken', res.body.token)
                            localStorage.setItem('token', res.body.token + Math.random().toFixed(3))
                            localStorage.setItem('user', res.body.result.id)
                            if (this.param.type === 'manager') {
                                location.href = location.origin + '/#/manage?token=' + res.body.token + Math.random().toFixed(3)
                            } else {
                                this.$router.push('/index')
                            }
                        }
                    })
            }
        },
        register() {
            if (!this.registerInfor.id) {
                this.$message('用户名不能为空')
            } else if (!this.registerInfor.pwd) {
                this.$message('密码不能为空')
            } else if (this.registerInfor.pwd !== this.registerInfor.confirm) {
                this.$message('两次密码不一致')
            } else if (!this.registerInfor.name) {
                this.$message('请填写真实姓名')
            } else if (this.registerInfor.phone.length !== 11) {
                this.$message('请输入正确的手机号')
            } else {
                this.$request
                    .post('/test/register')
                    .send({
                        ...this.registerInfor,
                        pwd: md(this.registerInfor.pwd)
                    })
                    .end((err, res) => {
                        if (!!err) {
                            this.$message({
                                type: 'error',
                                message: err.response.text
                            })
                        } else {
                            this.$message({
                                type: 'success',
                                message: '注册成功'
                            })
                            this.loginInfor.id = this.registerInfor.id
                            this.loginInfor.pwd = this.registerInfor.pwd
                            this.registerInfor = {
                                laboratory: '',
                                id: '',
                                pwd: '',
                                confirm: '',
                                name: '',
                                phone: '',
                                Email: ''
                            }
                            this.login = true
                        }
                    })
            }
        }
    }
}
</script>
<style lang="stylus">
.login
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: linear-gradient(to right, #6190e8, #a7bfe8)
    font-size: .14rem
    .icon
        width: .16rem
        height: .16rem
        vertical-align: top
        color: #666
    .form-wrapper
        height: 3.4rem
    .register-wrapper
        height: 5rem
        .goback
            float: left
            cursor: pointer
    .wrapper
        width: 2.8rem
        background: rgba(255, 255, 255, .2)
        padding: .2rem
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0
        margin: auto
        border-radius: .1rem
        .title
            font-size: .2rem
            font-family: 'Fantasy'
            margin-bottom: .4rem
        .input-wrapper
            display: flex
            width: 100%
            border-bottom: 1px solid #EBEEF5
            padding: .05rem
            text-align: left
            box-sizing: border-box
            margin-top: .2rem
            input
                flex: 1 1 auto
                margin-left: .03rem
                border: none
                background: none
                outline: none
            .label
                width: .46rem
                padding-right: .05rem
                box-sizing: border-box
                text-align: right
                font-size: .13rem
                color: #606266
        .help
            margin-top: .1rem
            font-size: .12rem
            text-align: left
            .forget
                float: right
                cursor: pointer
            .check
                .el-checkbox__label
                    font-size: .12rem
                    padding-left: .05rem
        .submit
            margin-top: .3rem
            .el-button
                width: 70%
                background: rgba(255, 255, 255, .2)
                font-size: .16rem
        .register
            margin-top: .3rem
            text-align: right
            .content
                cursor: pointer
                &:hover
                    color: #409EFF
</style>
