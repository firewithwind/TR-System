// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import request from 'superagent'
import router from './router'
import * as echarts from 'echarts'

Vue.use(Vuex)
Vue.use(ElementUI)

Vue.prototype.$request = request
Vue.prototype.$chart = echarts

Vue.config.productionTip = false

const store = new Vuex.Store({
    state: {
        user: {}
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        setToken(state, token) {
            state.token = token
        },
        setAvatar(state, url) {
            state.user.avatar = url
        }
    }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
