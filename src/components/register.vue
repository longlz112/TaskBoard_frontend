<!-- src/components/Signup.vue -->
<template>
  <div class="signup">
    <h2>注册</h2>
    <form @submit.prevent="handleSignup">
      <div>
        <label for="username">用户名:</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label for="email">邮箱:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">密码:</label>
        <input type="password" v-model="password" required />
      </div>
      <div>
        <label for="roles">角色:</label>
        <select v-model="roles" multiple>
          <option value="user">用户</option>
          <option value="admin">管理员</option>
          <option value="mod">版主</option>
        </select>
      </div>
      <button type="submit">注册</button>
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
      email: '',
      password: '',
      roles: [],
      errorMessage: ''
    };
  },
  methods: {
    handleSignup() {
      AuthService.register(this.username, this.email, this.password, this.roles)
          .then(() => {
            this.$router.push('/login'); // 注册成功后重定向到登录页面
          })
          .catch(err => {
            this.errorMessage = '注册失败: ' + err.response.data.message;
          });
    }
  }
};
</script>

<style scoped>
/* 添加样式 */
</style>
