// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import home from "@/components/Home.vue"
import login from "@/components/login.vue";
import register from "@/components/register.vue";
import profile from "@/components/profile.vue";
import Tasks from "@/components/Tasks.vue";
import TaskDetail from "@/components/TaskDetail.vue";
import TaskSearch from "@/components/TaskSearch.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: home
    },
    {
        path: '/login',
        name: 'Login',
        component: login
    },
    {
        path: '/signup',
        name: 'Signup',
        component: register
    },
    {
        path: '/profile',
        name: 'Profile',
        component: profile,
        meta: { requiresAuth: true }  // 添加认证标记
    },
    {
        path: '/tasks',
        name: 'Tasks',
        component: Tasks,
        meta: { requiresAuth: true }  // 添加认证标记
    },
    {
        path: '/tasks/:id',
        name: 'TaskDetail',
        component: TaskDetail,
        props: true,
        meta: { requiresAuth: true }  // 添加认证标记
    },
    {
        path: '/search',
        name: 'TaskSearch',
        component: TaskSearch,
        meta: { requiresAuth: true }  // 添加认证标记
    },
    // 其他路由...
];

const router = createRouter({
    history: createWebHistory('/'),
    routes
});

// 允许未登录访问的路由名称
const allowedRoutes = ['Home', 'Login', 'Signup'];

router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('user'));

    // 判断当前路由是否需要认证
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !user) {
        // 需要认证且未登录 → 重定向到登录页
        next({ name: 'Login' });
    } else if (!requiresAuth && user && to.name === 'Login') {
        // 已登录时访问登录页 → 重定向到首页
        next({ name: 'Home' });
    } else if (!allowedRoutes.includes(to.name) && !user) {
        // 访问未允许的路由且未登录 → 重定向到登录页
        next({ name: 'Login' });
    } else {
        // 其他情况放行
        next();
    }
});

export default router;