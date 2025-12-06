// src/js/routes.js
import store from './store.js';

// --- Pagine Comuni ---
import LoginPage from '../pages/login.js';
import NotFoundPage from '../pages/404.js';

// --- Volontari ---
import HomePage from '../pages/home.js';

// --- Super Admin ---
import AdminHomePage from '../pages/admin/home.js';
import AdminUsersPage from '../pages/admin/users.js';
import AdminOrgsPage from '../pages/admin/orgs.js';

// --- Org Admin (Manager) ---
import OrgAdminHomePage from '../pages/org-admin/home.js'; // <--- QUESTO MANCAVA!

var routes = [
  // 1. Rotta Volontari (Home)
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
      
      // Se sei Admin, redirect alla dashboard giusta
      if (user && user.role === 'super_admin') {
        reject();
        router.navigate('/admin/');
        return;
      }
      if (user && user.role === 'org_admin') {
        reject();
        router.navigate('/org-admin/');
        return;
      }
      
      resolve();
    }
  },
  
  // 2. Rotta Super Admin
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

      if (user && user.role === 'super_admin') {
        resolve();
      } else {
        reject();
        router.navigate('/'); 
      }
    }
  },
  // Sottopagine Super Admin
  {
    path: '/admin/users/',
    component: AdminUsersPage,
  },
  {
    path: '/admin/orgs/',
    component: AdminOrgsPage,
  },
  
  // 3. Rotta Org Admin (Manager Associazione)
  {
    path: '/org-admin/',
    component: OrgAdminHomePage,
    beforeEnter: function ({ resolve, reject }) {
      const router = this;
      const user = store.getters.user.value;

      if (!store.getters.isLoggedIn.value) {
        reject();
        router.navigate('/login/');
        return;
      }

      // Controllo Ruolo Org Admin
      if (user && user.role === 'org_admin') {
        resolve();
      } else {
        reject();
        // Redirect intelligente
        if (user && user.role === 'super_admin') router.navigate('/admin/');
        else router.navigate('/'); 
      }
    }
  },

  // 4. Login
  {
    path: '/login/',
    component: LoginPage,
  },

  // 5. Catch-All (404) - DEVE ESSERE ULTIMA
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;