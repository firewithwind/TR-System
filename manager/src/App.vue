<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
import {query} from '@/utils'

export default {
    name: 'App',
    data() {
        return {}
    },
    created() {
        let param = query(location.href.split('?')[1])
        if (!!param.token) {
            localStorage.setItem('token', param.token)
            this.$store.commit('setToken', param.token.slice(0, -5))
        }
        let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
        if (!token) {
            location.href = location.origin + '/#/login?type=manager'
        } else {
            if (!this.$store.state.user.id) {
                this.$request
                    .post('/test/getUserInfor')
                    .set('Authorization', 'Bearer ' + token)
                    .set('accept', 'json')
                    .end((err, res) => {
                        if (!!err) {
                            if (err.status === 401) {
                                location.href = location.origin + '/#/login?type=manager'
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  font-size: .14rem
</style>
