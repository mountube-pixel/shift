/* La palette: un pulsante per ogni blocco che il livello mette a
   disposizione, nell'ordine del livello. Solo stringhe, zero DOM. */

import { NOMI } from "./blocchi.js";

export function htmlPalette(blocchi) {
  return `<div>` + blocchi.map(t => {
    const [ic, nome, cat] = NOMI[t];
    return `<button class="${cat}" data-add="${t}">${ic} ${nome}</button>`;
  }).join("") + `</div>`;
}
