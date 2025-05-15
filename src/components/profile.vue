<!-- src/components/Profile.vue -->
<template>
  <div class="profile">
    <h2>用户资料</h2>
    <div v-if="user">
      <p><strong>用户名:</strong> {{ user.username }}</p>
      <p><strong>邮箱:</strong> {{ user.email }}</p>
      <button @click="editMode = true">编辑资料</button>
    </div>

    <div v-if="editMode">
      <h3>编辑资料</h3>
      <form @submit.prevent="updateProfile">
        <div>
          <label for="username">用户名:</label>
          <input type="text" v-model="user.username" required />
        </div>
        <div>
          <label for="email">邮箱:</label>
          <input type="email" v-model="user.email" required />
        </div>
        <button type="submit">保存</button>
        <button @click="editMode = false">取消</button>
        <div v-if="errorMessage">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import AuthService from '../services/AuthService';
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || {},
      editMode: false,
      errorMessage: ''
    };
  },
  methods: {
    updateProfile() {
      // 假设后端有一个更新用户资料的 API
      AuthService.updateProfile(this.user)
          .then(() => {
            this.editMode = false;
            alert('资料更新成功！');
          })
          .catch(err => {
            this.errorMessage = '更新失败: ' + err.response.data.message;
          });
    }
  }
};
</script>

<style scoped>
/* 添加样式 */
.profile {
  max-width: 400px;
  margin: auto;
}
</style>
