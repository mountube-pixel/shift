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
  el: '#app', // L'elemento root nell'index.html
  name: 'VolontaApp',
  theme: 'ios', // Forziamo iOS per avere il look più pulito/Soft UI
  darkMode: false,
  
  // Store (Lo configureremo dopo)
  store: {
    state: {
      user: { name: 'Alessandro', level: 3 }
    }
  },

  // Rotte
  routes: routes,
  
  // NOTA: Service Worker disabilitato temporaneamente per lo sviluppo
});