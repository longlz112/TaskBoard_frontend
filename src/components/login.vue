<!-- src/components/Login.vue -->
<template>
  <div class="login">
    <h2>登录</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">用户名:</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label for="password">密码:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">登录</button>
      <div v-if="errorMessage">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script>
import AuthService from '../services/AuthService';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    handleLogin() {
      // 登录成功后重定向
      AuthService.login(this.username, this.password)
          .then(() => {
            this.$router.push('/profile').then(() => {
              // 使用 setTimeout 刷新页面,确保刷新只发生一次
              setTimeout(() => {
                window.location.reload();
              }, 0); // 0 毫秒后执行，确保在路由切换后刷新
            });
          })
          .catch(err => {
            this.errorMessage = '登录失败: ' + err.response.data.message;
          });

    }
  }
};
</script>

<style scoped>
/* 添加样式 */
</style>
