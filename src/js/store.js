import { createStore } from 'framework7';

const store = createStore({
  state: {
    // Carichiamo lo stato iniziale dal LocalStorage se esiste
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
  },
  getters: {
    user({ state }) {
      return state.user;
    },
    token({ state }) {
      return state.token;
    },
    isLoggedIn({ state }) {
      return !!state.user && !!state.token;
    },
    isLoading({ state }) {
      return state.isLoading;
    }
  },
  actions: {
    async login({ state }, { email, password }) {
      state.isLoading = true;
      
      try {
        // Sostituisci con il tuo URL REALE di Hostinger
        const response = await fetch('https://shift.appap.it/api/v1/auth/login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Errore durante il login');
        }

        // Salva nello stato
        state.user = data.user;
        state.token = data.token; // Se il backend non manda token, usa una stringa placeholder

        // Persistenza nel LocalStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        state.isLoading = false;
        return true; // Successo

      } catch (error) {
        state.isLoading = false;
        throw error; // Rilancia l'errore alla UI per mostrarlo
      }
    },
    logout({ state }) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Qui potresti forzare un reload o redirect
    }
  },
});

export default store;