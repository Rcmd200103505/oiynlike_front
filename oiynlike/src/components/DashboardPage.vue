<template>
  <div>
    <h1>Dashboard</h1>
    <button @click="toggleMyGames">{{ showMyGames ? 'Назад' : 'Мои игры' }}</button>
    <button v-if="!showCreateGameForm" @click="toggleCreateGameForm">Создать игру</button>
    <button v-else @click="toggleCreateGameForm">Отмена</button>
    <!-- Форма для создания игры -->
    <div v-if="showCreateGameForm" class="create-game-form">
      <h2>Создание игры</h2>
      <form @submit.prevent="createGame">
        <label for="title">Заголовок:</label>
        <input type="text" id="title" v-model="gameForm.title" class="game-title-input" required>

        <label for="description">Описание:</label>
        <textarea id="description" v-model="gameForm.description" class="game-description-input" required></textarea>

        <label for="maxPlayers">Максимальное количество игроков:</label>
        <input type="number" id="maxPlayers" v-model="gameForm.max_players" class="game-max-players-input" required>

        <!-- Используйте v-model для связывания выбранной даты с gameForm.scheduled_time -->
        <label for="scheduledTime">Запланированное время:</label>
        <input type="datetime-local" id="scheduledTime" v-model="gameForm.scheduled_time" class="game-scheduled-time-input" required>

        <button type="submit" class="create-game-button">Создать игру</button>
      </form>
    </div>

    <div v-if="!showMyGames && !showCreateGameForm" class="others-games-list">
      <h2>Активные игры других пользователей</h2>
      <ul>
        <li v-for="game in othersGames" :key="game._id" class="game-item">
          <div class="game-title">{{ game.title }}</div>
          <div class="game-description">{{ game.description }}</div>
          <div class="game-scheduled-time">{{ formatScheduledTime(game.scheduled_time) }}</div>
        </li>
      </ul>
    </div>

    <!-- Список созданных игр -->
    <div v-if="showMyGames">
      <h2>Мои игры</h2>
      <ul>
        <li v-for="game in myGames" :key="game._id" class="game-item">
          <div class="game-title">{{ game.title }}</div>
          <div class="game-description">{{ game.description }}</div>
          <div class="game-scheduled-time">{{ formatScheduledTime(game.scheduled_time) }}</div>
        </li>
      </ul>
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
      showMyGames: false,
      showOthersGames: true,
      othersGames: [],
      gameForm: {
        title: '',
        description: '',
        max_players: 1,
        scheduled_time: ''
      },
      myGames: []
    };
  },
  methods: {
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
    toggleCreateGameForm() {
      this.showCreateGameForm = !this.showCreateGameForm;
      this.showMyGames = false;
      this.showOthersGames = false; // Скрываем список моих игр при открытии формы создания игры
    },
    toggleMyGames() {
      this.showMyGames = !this.showMyGames;
      this.showCreateGameForm = false;
      this.showOthersGames = false; // Скрываем форму создания игры при открытии списка моих игр
      if (this.showMyGames) {
        this.getMyGames();
      }
    },
    async getMyGames() {
      try {
        const token = localStorage.getItem('userToken');
        const response = await axios.get('http://161.35.19.27:8000/api/user/gamecards', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.myGames = response.data;
      } catch (error) {
        console.error('Ошибка при получении списка игр:', error.response.data);
        alert('Произошла ошибка при получении списка игр. Пожалуйста, попробуйте еще раз.');
      }
    },
    async createGame() {
      try {
        const token = localStorage.getItem('userToken');
        this.gameForm.scheduled_time = new Date(this.gameForm.scheduled_time).toISOString();
        const response = await axios.post('http://161.35.19.27:8000/api/gamecards', this.gameForm, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data) {
          alert('Игра успешно создана!');
          this.showCreateGameForm = false;
          this.gameForm.title = '';
          this.gameForm.description = '';
          this.gameForm.max_players = 1;
          this.gameForm.scheduled_time = ''; // Очистить scheduled_time после создания игры
        }
      } catch (error) {
        console.error('Ошибка при создании игры:', error.response.data);
        alert('Произошла ошибка при создании игры. Пожалуйста, попробуйте еще раз.');
      }
    },
    async getOthersGames() {
      try {
        const token = localStorage.getItem('userToken');
        const response = await axios.get('http://161.35.19.27:8000/api/gamecards?page=1&limit=20', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.othersGames = response.data;
      } catch (error) {
        console.error('Ошибка при получении списка активных игр:', error.response.data);
        alert('Произошла ошибка при получении списка активных игр. Пожалуйста, попробуйте еще раз.');
      }
    },
    formatScheduledTime(scheduledTime) {
      const date = new Date(scheduledTime);
      const day = date.getDate().toString().padStart(2, '0');
      const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
      const month = monthNames[date.getMonth()];
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day} ${month}, ${hours}:${minutes}`;
    }
  },
  async created() {
    this.getOthersGames();
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }
};
</script>

<style>
.game-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

.game-title {
  font-weight: bold;
}

.game-description {
  margin-top: 5px;
}

.game-scheduled-time {
  margin-top: 5px;
  color: #666;
  margin-bottom: 10px;
}
/* Стили для формы создания игры */
.create-game-form {
  margin-bottom: 20px; /* Отступ снизу формы */
}

/* Стили для каждого элемента формы */
.create-game-form label {
  display: block; /* Элементы label становятся блочными, чтобы они располагались друг над другом */
  margin-bottom: 5px; /* Отступ снизу каждого label */
}

/* Стили для поля ввода заголовка */
.game-title-input {
  width: 100%; /* Ширина поля ввода равна 100% от родительского контейнера */
  margin-bottom: 10px; /* Отступ снизу поля ввода */
}

/* Стили для поля ввода описания */
.game-description-input {
  width: 100%; /* Ширина поля ввода равна 100% от родительского контейнера */
  height: 100px; /* Высота поля ввода описания */
  margin-bottom: 10px; /* Отступ снизу поля ввода */
}

/* Стили для поля ввода максимального количества игроков */
.game-max-players-input {
  width: 100%; /* Ширина поля ввода равна 100% от родительского контейнера */
  margin-bottom: 10px; /* Отступ снизу поля ввода */
}

/* Стили для поля ввода запланированного времени */
.game-scheduled-time-input {
  width: 100%; /* Ширина поля ввода равна 100% от родительского контейнера */
  margin-bottom: 10px; /* Отступ снизу поля ввода */
}

/* Стили для кнопки создания игры */
.create-game-button {
  width: 100%; /* Ширина кнопки равна 100% от родительского контейнера */
}
.others-games-list .game-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

/* Стили для заголовка игры */
.others-games-list .game-title {
  font-weight: bold;
}

/* Стили для описания игры */
.others-games-list .game-description {
  margin-top: 5px;
}

/* Стили для запланированного времени игры */
.others-games-list .game-scheduled-time {
  margin-top: 5px;
  color: #666;
  margin-bottom: 10px;
}

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
