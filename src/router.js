// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import login from "@/components/login.vue";
import register from "@/components/register.vue";
import profile from "@/components/profile.vue";
import logout from "@/components/logout.vue";

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: login
    },
    {
        path: '/logout',
        name: 'Logout',
        component: logout
    },
    {
        path: '/signup',
        name: 'Signup',
        component: register
    },
    {
        path: '/profile',
        name: 'Profile',
        component: profile
    },
    // 其他路由...
];

const router = createRouter({
    history: createWebHistory('/'), // 直接使用根路径
    routes
});

// 添加路由守卫
router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('user')); // 从 localStorage 获取用户信息

    // 如果目标路由是需要认证的路由
    if (to.name === 'Profile' && !user) {
        next({ name: 'Login' }); // 重定向到登录页面
    } else {
        next(); // 继续导航
    }
});

export default router;
