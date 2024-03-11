<template>
  <div>
    <h1>Dashboard</h1>
    <button v-if="!showCreateGameForm" @click="toggleCreateGameForm">Создать игру</button>
    <button v-else @click="toggleCreateGameForm">Назад</button> <!-- Кнопка "Назад" -->
    <!-- Форма для создания игры -->
    <div v-if="showCreateGameForm">
      <h2>Создание игры</h2>
      <form @submit.prevent="createGame">
        <label for="title">Заголовок:</label>
        <input type="text" id="title" v-model="gameForm.title" required>

        <label for="description">Описание:</label>
        <textarea id="description" v-model="gameForm.description" required></textarea>

        <label for="maxPlayers">Максимальное количество игроков:</label>
        <input type="number" id="maxPlayers" v-model="gameForm.max_players" required>

        <label for="scheduledTime">Запланированное время:</label>
        <input type="datetime-local" id="scheduledTime" v-model="gameForm.scheduled_time" required>

        <button type="submit">Создать игру</button>
      </form>
    </div>
    
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
import axios from 'axios';

export default {
  name: 'DashboardPage',
  data() {
    return {
      user: null,
      showCreateGameForm: false,
      gameForm: {
        title: '',
        description: '',
        max_players: 1,
        scheduled_time: ''
      }
    };
  },
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
      this.$router.push({ name: 'Profile' });
    },
    // Функция для отображения и скрытия формы создания игры
    toggleCreateGameForm() {
      this.showCreateGameForm = !this.showCreateGameForm;
    },
    // Функция для создания игры
    async createGame() {
      try {
        const token = localStorage.getItem('userToken');
        this.gameForm.scheduled_time = new Date().toISOString();
        const response = await axios.post('http://161.35.19.27:8000/api/gamecards', this.gameForm, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Ответ сервера при создании игры:', response.data);

        // Дополнительная логика при успешном создании игры, например, обновление списка игр
        // Возвращаемся к предыдущему состоянию
        this.showCreateGameForm = false;

        // Выводим алерт при успешном создании игры
        if (response.data) {
          alert('Игра успешно создана!');
          this.showCreateGameForm = false;
          this.gameForm.title = '';
          this.gameForm.description = '';
          this.gameForm.max_players = 1;
          this.gameForm.scheduled_time = '';
        }
      } catch (error) {
        console.error('Ошибка при создании игры:', error.response.data);
        alert('Произошла ошибка при создании игры. Пожалуйста, попробуйте еще раз.');
      }
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
