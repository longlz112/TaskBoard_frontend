<!-- src/components/navbar.vue -->
<template>
  <nav>
    <router-link to="/login" v-if="!isLogin">登录</router-link>
    <router-link to="/signup" v-if="!isLogin">注册</router-link>
    <router-link to="/profile" v-if="isLogin">个人资料</router-link>
    <a href="#" @click.prevent="handleLogout" v-if="isLogin">注销</a>
  </nav>
</template>

<script>
import AuthService from '../services/AuthService';

export default {
  computed: {
    isLogin() {
      // 检查 localStorage 中是否存在用户信息
      return localStorage.getItem('user') !== null;
    }
  },
  methods: {
    handleLogout() {
      AuthService.logout();
      // 如果当前在需要登录的页面，则重定向到登录页
      if (this.$route.path !== '/login') {
        this.$router.push('/login').then(() => {
          // 使用 setTimeout 刷新页面,确保刷新只发生一次
          setTimeout(() => {
            window.location.reload();
          }, 0); // 0 毫秒后执行，确保在路由切换后刷新
        });
      }
    }
  }
};
</script>

<style scoped>
/* 添加样式 */
nav {
  display: flex;
  gap: 10px;
}
</style>