<template>
  <div>
    <h1>Profile</h1>
    <!-- Вывод информации о пользователе -->
    <button @click="toggleEditing">{{ editing ? 'Отменить' : 'Редактировать профиль' }}</button>
    <button v-if="editing" @click="saveProfile">Сохранить</button>
    <!-- Кнопка для загрузки фото -->
    <button v-if="editing" @click="uploadPhoto">Загрузить фото</button>
    <!-- Информация о пользователе -->
    <div v-if="user">
      <div class="photo-container" @mousedown="startDrag" @mousemove="drag" @mouseup="endDrag">
        <div class="photo" v-if="user && user.photo_url" 
             ref="photo"
             :style="{ 'background-image': 'url(' + user.photo_url + ')', 'transform': 'translate(' + posX + 'px, ' + posY + 'px)' }"></div>
        <div class="photo no-photo" v-else>No фото</div>
      </div>
      <div class="input-group">
        <label for="firstName">Имя:</label>
        <input type="text" :readonly="!editing" id="firstName" v-model="user.first_name">
      </div>
      <div class="input-group">
        <label for="lastName">Фамилия:</label>
        <input type="text" :readonly="!editing" id="lastName" v-model="user.last_name">
      </div>
      <div class="input-group">
        <label for="city">Город:</label>
        <input type="text" :readonly="!editing" id="city" v-model="user.city">
      </div>
      <div class="input-group">
        <label for="aboutUser">Информация о себе:</label>
        <textarea :readonly="!editing" id="aboutUser" v-model="user.about_user"></textarea>
      </div>
    </div>
    <button @click="logout">Выйти</button>
    
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
  name: 'ProfilePage',
  data() {
    return {
      user: null,
      editing: false,
      posX: 0,
      posY: 0,
      startX: 0,
      startY: 0,
      dragging: false
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
    logout() {
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
      this.$router.push({ name: 'AuthorizationPage' });
    },
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem('userToken');
        const response = await axios.get('http://161.35.19.27:8000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.user = response.data.user;
        // Проверяем, есть ли у пользователя фотография
        if (this.user && this.user.photo_url) {
          console.log(response)
          this.loadPhoto();
        }
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error.response.data);
        alert('Произошла ошибка при загрузке профиля. Пожалуйста, попробуйте еще раз.');
      }
    },
    loadPhoto() {
      // Создаем новый объект Image
      const image = new Image();
      // Устанавливаем src фотографии из photo_url
      image.src = this.user.photo_url;
      // Когда изображение загружено, устанавливаем его в фоновый стиль
      image.onload = () => {
        this.$refs.photo.style.backgroundImage = `url(${this.user.photo_url})`;
      };
    },
    toggleEditing() {
      this.editing = !this.editing;
    },
    async saveProfile() {
      try {
        const token = localStorage.getItem('userToken');
        const requestBody = this.user;
        console.log('Request Body:', requestBody);
        await axios.patch('http://161.35.19.27:8000/api/profile', requestBody, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert('Профиль успешно обновлен!');
        this.editing = false;
      } catch (error) {
        console.error('Ошибка при обновлении профиля:', error.response.data);
        alert('Произошла ошибка при обновлении профиля. Пожалуйста, попробуйте еще раз.');
      }
    },
    uploadPhoto() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => this.handleFileUpload(e.target.files[0]);
      input.click();
    },
    handleFileUpload(file) {
      const formData = new FormData();
      formData.append('photo', file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.user.photo_url = e.target.result;
      };
      reader.readAsDataURL(file);

      const token = localStorage.getItem('userToken');
      axios.post('http://161.35.19.27:8000/api/upload_photo', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        console.log('Response from server:', response);
        this.user.photo_url = response.data.photo_url; 
      })
      .catch(error => {
        console.error('Error uploading photo:', error);
      });
    },
    startDrag(event) {
      // Запомнить начальные координаты при нажат
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.dragging = true;
    },
    drag(event) {
      if (this.dragging) {
        // Вычислить изменение положения фотографии
        const deltaX = event.clientX - this.startX;
        const deltaY = event.clientY - this.startY;
        // Обновить координаты фотографии
        this.posX += deltaX;
        this.posY += deltaY;
        // Обновить начальные координаты для следующего перемещения
        this.startX = event.clientX;
        this.startY = event.clientY;
      }
    },
    endDrag() {
      this.dragging = false;
    }
  },
  created() {
    this.fetchUserProfile();
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

.input-group {
  margin-bottom: 10px;
}

.input-group label {
  display: block;
  font-weight: bold;
}
.input-group input, .input-group textarea {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-group textarea {
  height: 100px;
  resize: vertical;
}

.photo-container {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

.photo {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.no-photo {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}
</style>
