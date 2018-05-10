// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import request from 'superagent'
import router from './router'

Vue.use(ElementUI)
Vue.use(Vuex)
Vue.config.productionTip = false

Vue.prototype.$request = request

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
        logout(state) {
            delete state.token
            delete state.user
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
