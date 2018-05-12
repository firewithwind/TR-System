<template>
  <div id="app">
    <el-container>
        <el-header>
            <el-menu
              :default-active="activeIndex"
              class="el-menu"
              mode="horizontal"
              :router="true"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
                <el-menu-item class="main-page" index="/index">差旅报销</el-menu-item>
                <el-menu-item index="/reimbursement/index/createreq">差旅报销</el-menu-item>
                <el-menu-item index="/project">项目管理</el-menu-item>
                <el-menu-item index="/statistics">数据统计</el-menu-item>
                <el-menu-item class="user-info" index="/userInfor">
                    <el-badge>
                        <img class="logo" :src="$store.state.user&&$store.state.user.avatar||'http://localhost:3000/static/avatar/timg.jpeg'">
                    </el-badge>
                    <span>{{$store.state.user&&$store.state.user.name}}</span>
                    <span v-if="!$store.state.user||!$store.state.user.name">请登入</span>
                </el-menu-item>
            </el-menu>
        </el-header>
        <el-main class="index-content">
            <router-view />
        </el-main>
    </el-container>
  </div>
</template>

<script>
import {createSocket} from '@/utils'
export default {
  name: 'App',
    data() {
        return {
            activeIndex: 'index'
        }
    },
    computed: {
        user() {
            return this.$store.state.user
        }
    },
    created() {
        if (location.href.split('#')[1] && location.href.split('#')[1] === '/') {
            this.$router.replace('/index')
        }
        let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
        if (!token) {
            this.$router.push('/login')
        } else {
            if (!this.$store.state.user.id) {
                this.$request
                    .post('/test/getUserInfor')
                    .set('Authorization', 'Bearer ' + token)
                    .set('accept', 'json')
                    .end((err, res) => {
                        if (!!err) {
                            if (err.status === 401) {
                                this.$router.push('login')
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: err.response.text
                                })
                            }
                            return
                        }
                        // 判断状态有无更新
                        if (!!res.body.token) {
                            localStorage.setItem('token', res.body.token + Math.random().toFixed(3))
                            token = res.body.token
                        }
                        let socket = createSocket('http://localhost:3000', {
                            token: res.body.id
                        })
                        socket.on('message', (data) => {
                            let message = JSON.parse(data)
                            this.$notify.info({
                                title: '通知',
                                dangerouslyUseHTMLString: true,
                                message: message.data,
                                duration: 6000
                            })
                        })
                        this.$store.commit('setSocket', socket)
                        this.$store.commit('setToken', token)
                        this.$store.commit('setUser', res.body)
                    })
            } else {
                this.user = this.$store.state.user
            }
        }
    }
}
</script>

<style lang="stylus">
#app
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    .el-header
        position: fixed
        left: 0
        right: 0
        top: 0
        padding: 0
        z-index: 100
        .main-page
            font-size: .18rem
            border: none
            &:hover
                background-color: rgb(84, 92, 100)
        .user-info
            float: right
            border: none
            .logo
                width: .4rem
                height: .4rem
                border-radius: .4rem
            .el-badge__content
                margin-top: .15rem
            a
                text-decoration: none
    .index-content
        padding: .61rem 0 0 0
</style>
