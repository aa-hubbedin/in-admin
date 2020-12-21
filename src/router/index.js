import Vue from 'vue'
import VueRouter from 'vue-router'
// import Dashboard from '../views/Dashboard.vue'
import { authGuard } from "../auth/authGuard";

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Dashboard',
  //   component: Dashboard,
  //   beforeEnter: authGuard
  // },
    {
        path: '/',
        name: 'Candidates',
        component: () => import(/* webpackChunkName: "candidates" */ '../views/Candidates.vue'),
        beforeEnter: authGuard
    },
    // {
    //     path: '/projects',
    //     name: 'Projects',
    //     component: () => import(/* webpackChunkName: "projects" */ '../views/Projects.vue'),
    //     beforeEnter: authGuard
    // },
    {
        path: '/assessments',
        name: 'Assessments',
        component: () => import(/* webpackChunkName: "assessments" */ '../views/Assessments.vue'),
        beforeEnter: authGuard
    },
    {
        path: '/assessments/:id',
        name: 'AssessmentShow',
        component: () => import(/* webpackChunkName: "assessmentshow" */ '../views/AssessmentShow.vue'),
        beforeEnter: authGuard,
        props: true
    },
    {
        path: '*',
        name: 'Not Found',
        component: () => import(/* webpackChunkName: "notfound" */ '../views/NotFound.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
