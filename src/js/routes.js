import store from './store.js';

import HomePage from '../pages/home.js';
import AdminHomePage from '../pages/admin/home.js';
import LoginPage from '../pages/login.js';
import NotFoundPage from '../pages/404.js';
import AdminUsersPage from '../pages/admin/users.js';
import AdminOrgsPage from '../pages/admin/orgs.js';

var routes = [
  // Rotta Volontari
  {
    path: '/',
    component: HomePage,
    beforeEnter: function ({ resolve, reject }) {
      const router = this;
      const user = store.getters.user.value;
      
      if (!store.getters.isLoggedIn.value) {
        reject();
        router.navigate('/login/');
        return;
      }
      
      // Se sei Admin, non dovresti stare qui -> vai alla Admin Dash
      if (user && user.role === 'super_admin') {
        reject();
        router.navigate('/admin/');
        return;
      }
      
      resolve();
    }
  },
  
  // Rotta Super Admin
  {
    path: '/admin/',
    component: AdminHomePage,
    beforeEnter: function ({ resolve, reject }) {
      const router = this;
      const user = store.getters.user.value;

      if (!store.getters.isLoggedIn.value) {
        reject();
        router.navigate('/login/');
        return;
      }

      // Controllo Ruolo Rigoroso
      if (user && user.role === 'super_admin') {
        resolve();
      } else {
        // Se sei un volontario e provi a entrare qui -> ti calcio via
        reject();
        router.navigate('/'); 
      }
    }
  },

  // Lista Utenti (SPOSTATO PRIMA DEL 404)
  {
    path: '/admin/users/',
    component: AdminUsersPage,
  },
  
  {
    path: '/login/',
    component: LoginPage,
  },

  {
    path: '/admin/orgs/',
    component: AdminOrgsPage,
},

  // La rotta 404 deve essere SEMPRE l'ultima
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;