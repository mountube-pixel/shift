import Framework7 from 'framework7/bundle';

// Importa stili Framework7
import 'framework7/css/bundle';
import 'framework7-icons/css/framework7-icons.css';

// Importa il tuo CSS personalizzato
import '../css/app.css';

// Importa le Rotte
import routes from './routes.js';

// Inizializzazione App
var app = new Framework7({
  el: '#app',
  
  // Nome App Aggiornato
  name: 'SHIFT',
  
  theme: 'ios',
  darkMode: false,
  
  // Store Globale
  store: {
    state: {
      user: { name: 'Alessandro', level: 3 }
    }
  },

  // Rotte
  routes: routes,
});