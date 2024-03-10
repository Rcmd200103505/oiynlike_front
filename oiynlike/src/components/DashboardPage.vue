<template>
  <div>
    <h1>Dashboard</h1>
    <div v-if="user">
      <p>Welcome, {{ user.name }}!</p>
      <p>Email: {{ user.email }}</p>
      <p>Role: {{ user.role }}</p>
    </div>
    <div v-else>
      <p>Please log in to access the dashboard.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPage',
  data() {
    return {
      user: null
    };
  },
  created() {
    // Предположим, что вы получаете информацию о пользователе после успешной авторизации
    // и сохраняете ее в localStorage или в хранилище Vuex.
    // В этом примере мы предполагаем, что информация о пользователе находится в localStorage.
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }
};
</script>

<style>
/* Стили для DashboardPage.vue */
</style>
