<template>
    <div>
      <h1>Авторизация и Регистрация</h1>
  
      <div v-if="!loggedIn">
        <h2>Вход</h2>
        <form @submit.prevent="login">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="loginForm.email" required>
          
          <label for="password">Пароль:</label>
          <input type="password" id="password" v-model="loginForm.password" required>
  
          <button type="submit">Войти</button>
        </form>
      </div>
  
      <div v-if="!loggedIn">
        <h2>Регистрация</h2>
        <form @submit.prevent="register">
          <label for="firstName">Имя:</label>
          <input type="text" id="firstName" v-model="registerForm.firstName" required>
          
          <label for="lastName">Фамилия:</label>
          <input type="text" id="lastName" v-model="registerForm.lastName" required>
          
          <label for="newEmail">Email:</label>
          <input type="email" id="newEmail" v-model="registerForm.email" required>
          
          <label for="newPassword">Пароль:</label>
          <input type="password" id="newPassword" v-model="registerForm.password" required>
  
          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
  
  
      <div v-if="loggedIn">
        <h2>Добро пожаловать, {{ loggedInUser }}!</h2>
        <button @click="logout">Выйти</button>
      </div>
  
      <!-- WebView -->
      <iframe v-if="showWebView" src="https://example.com" width="100%" height="500px"></iframe>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'AuthorizationPage',
    data() {
      return {
        loggedIn: false,
        loggedInUser: null,
        loginForm: {
          email: '',
          password: ''
        },
        registerForm: {
          first_name: '',
          last_name: '',
          password: '',
          email: '',
          user_type: ''
        },
        showWebView: false
      };
    },
    methods: {
      async login() {
        console.log('Метод login вызван');
        try {
          const response = await axios.post('http://161.35.19.27:8000/users/login', {
            email: this.loginForm.email,
            password: this.loginForm.password
          });
          
          if (response.status === 200) {
            alert('Успешный вход');
            this.loggedIn = true;
            this.loggedInUser = this.loginForm.email;
            localStorage.setItem('loggedIn', true);
            this.$router.push({ name: 'DashboardPage' });
          } 
        } catch (error) {
          if (error.response && error.response.data.error) {
            console.error('Ошибка входа:', error.response.data);
            alert('Неудачная попытка входа. Пожалуйста, проверьте свои учетные данные.');
          }
        }
      },
      async register() {
        console.log('Метод signup вызван');
        try {
          const response = await axios.post('http://161.35.19.27:8000/users/signup', {
          first_name: this.registerForm.firstName,
          last_name: this.registerForm.lastName,
          email: this.registerForm.email,
          password: this.registerForm.password,
          user_type: "USER"
        });
  
        if (response.status === 200) {
          alert('Успешная регистрация');
          this.loggedIn = true;
          this.loggedInUser = this.registerForm.email;
        } 
      } catch (error) {
        if (error.response && error.response.status === 409) {
            console.error('Ошибка регистрации:', error.response.data.error);
            alert('Этот адрес электронной почты уже существует. Пожалуйста, используйте другую.');
      } if (error.response && error.response.status === 400) {
            console.error('Ошибка регистрации:', error.response.data.error);
            alert('Данный пароль не подходит. Пожалуйста, замените его.');
      } else {
            console.error('Ошибка регистрации:', error.response.data.error);
            alert('Неудачная попытка регистрации. Пожалуйста, проверьте свои данные.')
    }
  }
  
      },
      logout() {
        console.log('Выход пользователя');
        this.loggedIn = false;
        this.loggedInUser = null;
        this.clearLoginForm(); 
      },
  
      clearLoginForm() {
        this.loginForm.email = '';
        this.loginForm.password = '';
      }
    }
  };
  </script>
  
  <style scoped>
  /* Стили для форм */
  form {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }
  
  /* Стили для input и label */
  label {
    margin-bottom: 5px;
  }
  
  input {
    padding: 5px;
    margin-bottom: 10px;
  }
  
  /* Стили для кнопок */
  button {
    padding: 8px 15px;
    margin-top: 10px;
    cursor: pointer;
  }
  
  /* Стили для h1 и h2 */
  h1, h2 {
    margin-bottom: 20px;
  }
  </style>
  