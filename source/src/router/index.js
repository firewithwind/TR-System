import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Reimbursement from '@/components/Reimbursement'
import CreateReq from '@/components/CreateReq'
import CreateReim from '@/components/CreateReim'
import ReqUndone from '@/components/ReqUndone'
import ReqUnremark from '@/components/ReqUnremark'
import ReqFind from '@/components/ReqFind'
import ReqDetail from '@/components/ReqDetail'
import ReimUndone from '@/components/ReimUndone'
import ReimUnremark from '@/components/ReimUnremark'
import ReimDetail from '@/components/ReimDetail'
import Detail from '@/components/Detail'
import Statistics from '@/components/Statistics'
import Login from '@/components/Login'
import User from '@/components/User'
import Project from '@/components/Project'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/index',
            name: 'index',
            component: Index
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/userInfor',
            name: 'userInfor',
            component: User
        },
        {
            path: '/project',
            name: 'project',
            component: Project
        },
        {
            path: '/reimbursement/:id',
            component: Reimbursement,
            children: [
                {
                    path: 'createreq',
                    component: CreateReq
                },
                {
                    path: 'createreim',
                    component: CreateReim
                },
                {
                    path: 'requndone',
                    component: ReqUndone
                },
                {
                    path: 'requnremark',
                    component: ReqUnremark
                },
                {
                    path: 'reimundone',
                    component: ReimUndone
                },
                {
                    path: 'reimunremark',
                    component: ReimUnremark
                },
                {
                    path: 'find',
                    component: ReqFind
                },
                {
                    path: 'reqdetail',
                    component: ReqDetail
                },
                {
                    path: 'reimdetail',
                    component: ReimDetail
                },
                {
                    path: 'detail',
                    component: Detail
                }
            ]
        },
        {
            path: '/statistics',
            component: Statistics
        }
    ]
})
