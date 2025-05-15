<!-- src/components/Logout.vue -->
<template>
  <div>
    <h2>注销</h2>
    <button @click="handleLogout">注销</button>
  </div>
</template>

<script>
import AuthService from '../services/AuthService';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const handleLogout = () => {
      AuthService.logout().then(() => {
        // 注销成功后，重定向到登录页面
        router.push('/login');
        alert('您已成功注销！');
      }).catch(err => {
        console.error('注销失败:', err);
        alert('注销失败，请重试。');
      });
    };

    return { handleLogout };
  }
};
</script>

<style scoped>
/* 添加样式 */
button {
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
