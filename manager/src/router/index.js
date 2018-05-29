import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Project from '@/components/Project'
import Person from '@/components/Person'
import Policy from '@/components/Policy'
import PolicyDetail from '@/components/PolicyDetail'
import Dictionary from '@/components/Dictionary'

Vue.use(Router)

export default new Router({
  routes: [
    {
        path: '/',
        name: 'Index',
        component: Index
    },
    {
        path: '/manage',
        component: Index,
        children: [
            {
                path: 'project',
                component: Project
            },
            {
                path: 'person',
                component: Person
            },
            {
                path: 'policy',
                component: Policy
            },
            {
                path: 'policy/detail',
                component: PolicyDetail
            },
            {
                path: 'dictionary',
                component: Dictionary
            }
        ]
    }
  ]
})
