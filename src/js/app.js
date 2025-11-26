import $ from 'dom7';
import Framework7 from 'framework7/bundle';
import 'framework7/css/bundle';
import '../css/icons.css';
import '../css/app.css';

import routes from './routes.js';
import store from './store.js';

// --- MODIFICA QUI ---
// Invece di import App from '../app.f7';
import App from './app-component.js'; 
// --------------------

var app = new Framework7({
  name: 'SHIFT',
  theme: 'auto',
  el: '#app',
  component: App, // Ora carica il componente JS puro
  store: store,
  routes: routes,
  // serviceWorker commentato come da step precedenti
});