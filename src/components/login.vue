<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleLogin">
      <h2>登录</h2>
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit">登录</button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
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
      AuthService.login(this.username, this.password)
          .then(() => {
            this.$router.push('/profile').then(() => {
              setTimeout(() => {
                window.location.reload();
              }, 0);
            });
          })
          .catch(err => {
            this.errorMessage = '登录失败: ' + (err.response?.data?.message || '请检查账号密码');
          });
    }
  }
};
</script>

<style scoped>
.login-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;

}
.login-form {
  background: #fff;
  padding: 32px 28px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  width: 320px;
}
.login-form h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}
.form-group {
  margin-bottom: 18px;
}
.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #555;
}
.form-group input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #dcdde1;
  border-radius: 6px;
  font-size: 15px;
  outline: none;
  transition: border 0.2s;
}
.form-group input:focus {
  border-color: #4f8cff;
}
button[type="submit"] {
  width: 100%;
  padding: 10px 0;
  background: #4f8cff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}
button[type="submit"]:hover {
  background: #357ae8;
}
.error-message {
  margin-top: 14px;
  color: #e74c3c;
  text-align: center;
  font-size: 14px;
}
</style>
