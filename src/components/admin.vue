<script>
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || {},
    };
  },
}
</script>

<template>
<!--  嵌入kibanan面板  -->
  <div v-if="user.roles.includes('ROLE_ADMIN')" class="dashboard">
    <iframe src="http://localhost:5601/app/dashboards#/view/52dc1f8c-a636-42fe-bde5-c2fddd27b4f9?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A60000)%2Ctime%3A(from%3Anow-7d%2Fd%2Cto%3Anow))&show-time-filter=true" height="800" width="90% "></iframe>
    <iframe src="http://localhost:5601/app/dashboards#/view/90bc7908-f4c3-409a-92fe-e4b5747b5710?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A60000)%2Ctime%3A(from%3Anow-30d%2Fd%2Cto%3Anow))&show-time-filter=true" height="800" width="90%"></iframe>
  </div>
</template>

<style scoped>
.dashboard iframe{
  transform: translateX(6%);
}
</style>