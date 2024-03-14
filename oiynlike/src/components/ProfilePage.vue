<template>
    <div>
      <h1>Profile</h1>
      <button @click="logout">Выйти</button> <!-- Добавляем обработчик события для кнопки "Выйти" -->
      
      <!-- Навигационные кнопки -->
      <footer>
        <button @click="goToHomepage">Dashboard</button>
        <button @click="goToChat">Chat</button>
        <button @click="goToMap">Map</button>
        <button @click="goToGamesList">Games List</button>
        <button @click="goToCalendar">Calendar</button>
        <button @click="goToProfile">Profile</button>
      </footer>
    </div>
  </template>
  
  <script>
  
  
  export default {
    name: 'ProfilePage',
    methods: {
      // Функции для перехода по кнопкам
      goToHomepage() {
        this.$router.push({ name: 'DashboardPage' });
      },
      goToChat() {
        this.$router.push({ name: 'Chat' });
      },
      goToMap() {
        this.$router.push({ name: 'Map' });
      },
      goToGamesList() {
        this.$router.push({ name: 'GamesList' });
      },
      goToCalendar() {
        this.$router.push({ name: 'Calendar' });
      },
      goToProfile() {
        this.$router.push({ name: 'ProfilePage' });
      },
      logout() {
        // Ваша логика для выхода из профиля
        // Например, очистка локального хранилища и перенаправление на страницу авторизации
        localStorage.removeItem('user');
        localStorage.removeItem('userToken');
        this.$router.push({ name: 'AuthorizationPage' }); // Предполагается, что у вас есть страница с названием 'LoginPage' для авторизации
      }
    },
    created() {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
  };
  </script>
  
  <style>
  footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #f0f0f0;
    padding: 10px;
    display: flex;
    justify-content: space-around;
  }
  </style>
  