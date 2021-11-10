import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/main/Home.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            name: 'home',
            component: home,
            alias: ['/home']
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/main/About.vue')
        },
        {
            path: '/list',
            name: 'list',
            component: () => import('../views/main/UpList.vue')
        },
        {
            path: '/space/:mid',
            name: 'space',
            component: () => import('../views/main/VideoList.vue')
        },
        {
            path: '/video/:bvid',
            name: 'video',
            component: () => import('../views/main/Video.vue')
        },
        {
            path: '/myspace/:id',
            name: 'myspace',
            component: () => import('../views/main/MySpace.vue')
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('../views/admin/Admin.vue'),
            children: [
                { path: '', redirect: '/admin/home' },
                { path: 'home', name: 'admin/home', component: () => import('../views/admin/AdminHome.vue') },
                { path: 'table', name: 'admin/table', component: () => import('../views/admin/Table.vue') },
                { path: 'mapreduce', name: 'admin/mapreduce', component: () => import('../views/admin/MapReduce.vue') },
                { path: 'hive', name: 'admin/hive', component: () => import('../views/admin/Hive.vue') },
                { path: 'mcharts', name: 'admin/mcharts', component: () => import('../views/admin/MCharts.vue') },
                { path: 'hcharts', name: 'admin/hcharts', component: () => import('../views/admin/HCharts.vue') }
            ]
        },
        {
            path: '/404',
            name: '404',
            component: () => import('@/views/main/404.vue')
        },
        // {
        //     path: '*',
        //     redirect: '/404'
        // }
    ]
})

export default router
