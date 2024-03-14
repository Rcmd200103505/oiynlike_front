import { createRouter, createWebHistory } from 'vue-router';
import AuthorizationPage from '@/components/AuthorizationPage.vue';
import DashboardPage from '@/components/DashboardPage.vue';
import ProfilePage from '@/components/ProfilePage.vue';

const routes = [
  {
    path: '/',
    name: 'AuthorizationPage',
    component: AuthorizationPage
  },
  {
    path: '/dashboard',
    name: 'DashboardPage',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'ProfilePage',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  // Другие маршруты
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('loggedIn');

  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router;
