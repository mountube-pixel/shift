/* Il programma in miniatura che accompagna il replay a schermo intero:
   sola lettura e compatto. Mentre il robot corre, la vista accende il
   blocco in esecuzione, rischiara i blocchi che lo contengono e scrive nei
   cicli a che giro sono. Qui solo stringhe e dati, zero DOM. */

import { SENSORI, OPERATORI } from "../motore/indice.js";
import { NOMI } from "./blocchi.js";

const CICLI = ["ripeti", "finche", "sempre"];

export function etichetta(n) {
  if (n.t === "ripeti") return `ripeti <b>${n.n} volte</b>`;
  if (n.t === "finche") return `ripeti finché <b>${SENSORI[n.c]}</b>`;
  if (n.t === "sempre") return "ripeti per sempre";
  if (n.t === "se") {
    const op = n.op || "base";
    return `se <b>${SENSORI[n.c]}</b>` + (op !== "base" ? ` ${OPERATORI[op]} <b>${SENSORI[n.c2]}</b>` : "");
  }
  return NOMI[n.t][1];
}

export function htmlTraccia(prog) {
  return `<div class="tr-lista">${prog.map(riga).join("")}</div>`;
}

const VUOTO = `<div class="tr-vuoto">vuoto</div>`;

function riga(n) {
  const [ic, , cat] = NOMI[n.t];
  const giro = CICLI.includes(n.t) ? `<span class="giro" data-giro="${n.id}"></span>` : "";
  const testa = `<div class="tr-bl ${cat}" data-tid="${n.id}"><span class="ic">${ic}</span>` +
    `<span class="tr-nome">${etichetta(n)}</span>${giro}</div>`;
  if (!n.body) return testa;
  let h = testa + `<div class="tr-dentro">${n.body.map(riga).join("") || VUOTO}</div>`;
  if (n.alt) h += `<div class="tr-alt">altrimenti</div><div class="tr-dentro">${n.alt.map(riga).join("") || VUOTO}</div>`;
  return `<div class="tr-cont">${h}</div>`;
}

/* Per ogni blocco, gli id dei blocchi che lo contengono, dal più esterno. */
export function antenati(prog) {
  const mappa = new Map();
  const cammina = (lista, su) => {
    for (const n of lista) {
      mappa.set(n.id, su);
      const qui = su.concat(n.id);
      if (n.body) cammina(n.body, qui);
      if (n.alt) cammina(n.alt, qui);
    }
  };
  cammina(prog, []);
  return mappa;
}

/* «giro 2/4» per il ripeti, che sa quanti giri farà; «giro 2» per gli altri. */
export const testoGiro = g => "giro " + g.giro + (g.di ? "/" + g.di : "");
