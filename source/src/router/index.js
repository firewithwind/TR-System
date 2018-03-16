import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Reimbursement from '@/components/Reimbursement'
import Create from '@/components/Create'
import ReqUndone from '@/components/ReqUndone'
import ReqUnremark from '@/components/ReqUnremark'
import ReqFind from '@/components/ReqFind'
import Detail from '@/components/Detail'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/index',
            name: 'index',
            component: Index
        },
        {
            path: '/reimbursement/:id',
            component: Reimbursement,
            children: [
                {
                    path: 'create',
                    component: Create
                },
                {
                    path: 'undone',
                    component: ReqUndone
                },
                {
                    path: 'unremark',
                    component: ReqUnremark
                },
                {
                    path: 'find',
                    component: ReqFind
                },
                {
                    path: 'detail',
                    component: Detail
                }
            ]
        }
    ]
})
