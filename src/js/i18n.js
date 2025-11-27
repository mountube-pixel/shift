// src/js/i18n.js
import i18next from 'i18next';
import it from './locales/it.js';
import en from './locales/en.js';
import de from './locales/de.js';

// Recupera la lingua salvata o usa quella del browser, o default italiano
const savedLang = localStorage.getItem('lang') || 'it';

i18next.init({
  lng: savedLang, // Lingua attiva
  fallbackLng: 'it', // Se manca una traduzione, usa l'italiano
  debug: false,
  resources: {
    it,
    en,
    de
  }
});

// Funzione helper per cambiare lingua
export const changeLanguage = (lang) => {
  i18next.changeLanguage(lang);
  localStorage.setItem('lang', lang);
  // Ricarica la pagina per applicare le modifiche a tutta l'UI
  window.location.reload(); 
};

// Esportiamo l'istanza e una funzione short 't'
export const t = (key, options) => i18next.t(key, options);
export default i18next;