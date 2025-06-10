<template>
  <div class="signup-container">
    <form class="signup-form" @submit.prevent="handleSignup">
      <h2>注册</h2>
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">确认密码</label>
        <input type="password" v-model="confirmPassword" id="confirmPassword" required />
      </div>
      <button type="submit">注册</button>
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
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: ''
    };
  },
  methods: {
    handleSignup() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = '两次输入的密码不一致';
        return;
      }
      AuthService.register(this.username, this.email, this.password)
          .then(() => {
            this.$router.push('/login');
          })
          .catch(err => {
            this.errorMessage = '注册失败: ' + (err.response?.data?.message || '未知错误');
          });
    }
  }
};
</script>

<style scoped>
.signup-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;

}
.signup-form {
  background: #fff;
  padding: 32px 28px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  width: 340px;
}
.signup-form h2 {
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
