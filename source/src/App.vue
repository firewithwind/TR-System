<template>
  <div id="app">
    <el-menu
      :default-active="activeIndex"
      class="el-menu"
      mode="horizontal"
      :router="true"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
        <el-menu-item class="main-page" index="/index">差旅报销</el-menu-item>
        <el-menu-item index="/reimbursement/index/create">差旅报销</el-menu-item>
        <el-menu-item index="/project">项目管理</el-menu-item>
        <el-menu-item index="/statistics">数据统计</el-menu-item>
        <el-menu-item class="user-info" index="/userInfor">
            <el-badge is-dot>
                <img class="logo" src="./assets/logo.png">
            </el-badge>
            <a href="user">{{user.name}}</a>
            <span v-if="!user.name"><span>登入</span>|<span>注册</span></span>
        </el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
    data() {
        return {
            activeIndex: 'index',
            user: {}
        }
    },
    created() {
        let id = localStorage.getItem('user')
        if (!!id) {
            this.$request
                .post('/test/getUserInfor')
                .send({
                    id: id
                })
                .set('accept', 'json')
                .end((err, res) => {
                    if (!!err) {
                        console.log(err)
                        return
                    }
                    this.user = res.body
                    this.$store.commit('setUser', res.body)
                })
        } else {
            localStorage.setItem('user', '00000001')
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
</style>
