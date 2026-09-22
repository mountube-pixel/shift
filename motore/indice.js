/* Punto d'ingresso del motore: modello puro, zero DOM, zero canvas.
   Tutto ciò che UI, render e rete useranno del gioco passa da qui. */

export { AZIONI, CONTROLLI, SENSORI, OPERATORI, nuovoBlocco, contaBlocchi, validaProgramma } from "./blocchi.js";
export { DIRS, LIMITI, esegui, battitiDi } from "./esegui.js";
export { ottimo } from "./ottimo.js";
export { CHIAVI_OGGETTI, validaLivello } from "./livello.js";
