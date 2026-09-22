/* La vista dei blocchi: trasforma programma + cursore in HTML.
   Non tocca il documento: costruisce stringhe, e assegna a ogni fessura un
   numero progressivo (data-k) nello stesso ordine di posizioni() del
   cursore, così un tocco sulla fessura k corrisponde alla posizione k. */

import { SENSORI, OPERATORI } from "../motore/indice.js";

/* icona, nome parlato, categoria di colore (m movimento, c controllo, u attrezzo) */
export const NOMI = {
  avanti: ["👟", "avanti", "m"],
  dx: ["↻", "gira a destra", "m"],
  sx: ["↺", "gira a sinistra", "m"],
  usa: ["🛠", "usa l'attrezzo", "u"],
  aspetta: ["⏳", "aspetta", "m"],
  accendi: ["💡", "accendi la spia", "m"],
  spegnispia: ["🌑", "spegni la spia", "m"],
  ripeti: ["🔁", "ripeti", "c"],
  finche: ["🔁", "ripeti finché", "c"],
  se: ["❓", "se", "c"],
  sempre: ["♾", "ripeti per sempre", "c"],
};

export function htmlProgramma(prog, cursore) {
  const conta = { k: 0 };
  const corpo = htmlLista(prog, cursore, conta);
  const vuoto = prog.length ? "" : `<div class="vuoto">Tocca un blocco qui sotto per cominciare</div>`;
  return vuoto + corpo;
}

function htmlFessura(l, i, cursore, conta) {
  const attiva = cursore && cursore.l === l && cursore.i === i;
  return `<div class="slot ${attiva ? "attivo" : ""}" data-k="${conta.k++}"></div>`;
}

function htmlLista(l, cursore, conta) {
  let h = `<div class="lista">`;
  for (let i = 0; i < l.length; i++) {
    h += htmlFessura(l, i, cursore, conta);
    h += htmlBlocco(l[i], cursore, conta);
  }
  h += htmlFessura(l, l.length, cursore, conta);
  return h + `</div>`;
}

const valore = (id, cicla, testo, extra = "") =>
  `<button class="val" data-cicla="${cicla}" data-id="${id}"${extra}>${testo}</button>`;

function htmlBlocco(n, cursore, conta) {
  const [ic, nome, cat] = NOMI[n.t];
  const elimina = `<button class="x" data-rm="${n.id}" aria-label="elimina">✕</button>`;

  if (n.t === "ripeti") return `<div>
    <div class="bl c" data-id="${n.id}"><span class="ic">${ic}</span><span>ripeti</span>
      ${valore(n.id, "n", n.n + " volte")}<span class="sp"></span>${elimina}</div>
    <div class="dentro">${htmlLista(n.body, cursore, conta)}</div>
    <div class="bl c piede"></div></div>`;

  if (n.t === "finche") return `<div>
    <div class="bl c" data-id="${n.id}"><span class="ic">${ic}</span><span>ripeti finché</span>
      ${valore(n.id, "sens", SENSORI[n.c])}<span class="sp"></span>${elimina}</div>
    <div class="dentro">${htmlLista(n.body, cursore, conta)}</div>
    <div class="bl c piede"></div></div>`;

  if (n.t === "sempre") return `<div>
    <div class="bl c" data-id="${n.id}"><span class="ic">${ic}</span><span>ripeti per sempre</span>
      <span class="sp"></span>${elimina}</div>
    <div class="dentro">${htmlLista(n.body, cursore, conta)}</div>
    <div class="bl c piede"></div></div>`;

  if (n.t === "se") {
    const op = n.op || "base";
    return `<div>
    <div class="bl c" data-id="${n.id}"><span class="ic">${ic}</span><span>se</span>
      ${valore(n.id, "sens", SENSORI[n.c])}
      ${valore(n.id, "op", OPERATORI[op], ' data-op="1"')}
      ${op !== "base" ? valore(n.id, "sens2", SENSORI[n.c2]) : ""}
      <span class="sp"></span>
      <button class="x" data-alt="${n.id}">${n.alt ? "–" : "+"} altrimenti</button>${elimina}</div>
    <div class="dentro">${htmlLista(n.body, cursore, conta)}</div>
    ${n.alt ? `<div class="varamo">altrimenti</div>
      <div class="dentro">${htmlLista(n.alt, cursore, conta)}</div>` : ""}
    <div class="bl c piede"></div></div>`;
  }

  return `<div class="bl ${cat}" data-id="${n.id}"><span class="ic">${ic}</span>
    <span>${nome}</span><span class="sp"></span>${elimina}</div>`;
}
