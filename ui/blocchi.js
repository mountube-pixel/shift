/* La vista dei blocchi: trasforma programma + cursore in HTML.
   Non tocca il documento: costruisce stringhe, e assegna a ogni fessura un
   numero progressivo (data-k) nello stesso ordine di posizioni() del
   cursore, così un tocco sulla fessura k corrisponde alla posizione k.
   Ogni blocco ha una maniglia (data-presa) per spostarlo, e il suo ingombro
   intero, corpo compreso, porta data-gid: è ciò che si solleva. */

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

/* opzioni.inMano: l'id del blocco preso con un tocco sulla maniglia;
   opzioni.bersagli: le fessure (numeri k) dove quel blocco può andare. */
export function htmlProgramma(prog, cursore, opzioni = {}) {
  const ctx = { cursore, k: 0, inMano: opzioni.inMano ?? null, bersagli: opzioni.bersagli || null };
  const corpo = htmlLista(prog, ctx);
  const vuoto = prog.length ? "" : `<div class="vuoto">Tocca un blocco qui sotto per cominciare</div>`;
  return vuoto + corpo;
}

function htmlFessura(l, i, ctx) {
  const k = ctx.k++;
  let classi = "slot";
  if (ctx.cursore && ctx.cursore.l === l && ctx.cursore.i === i) classi += " attivo";
  if (ctx.bersagli && ctx.bersagli.has(k)) classi += " bersaglio";
  return `<div class="${classi}" data-k="${k}"></div>`;
}

function htmlLista(l, ctx) {
  let h = `<div class="lista">`;
  for (let i = 0; i < l.length; i++) {
    h += htmlFessura(l, i, ctx);
    h += htmlBlocco(l[i], ctx);
  }
  h += htmlFessura(l, l.length, ctx);
  return h + `</div>`;
}

const valore = (id, cicla, testo, extra = "") =>
  `<button class="val" data-cicla="${cicla}" data-id="${id}"${extra}>${testo}</button>`;

const presa = id => `<button class="presa" data-presa="${id}" aria-label="sposta il blocco"></button>`;

function htmlBlocco(n, ctx) {
  const [ic, nome, cat] = NOMI[n.t];
  const elimina = `<button class="x" data-rm="${n.id}" aria-label="elimina">✕</button>`;
  const mano = n.id === ctx.inMano ? " inMano" : "";
  const gruppo = (testa, corpo) =>
    `<div class="gruppo${mano}" data-gid="${n.id}">${testa}${corpo}<div class="bl c piede"></div></div>`;
  const testa = contenuto =>
    `<div class="bl c" data-id="${n.id}">${presa(n.id)}<span class="ic">${ic}</span>${contenuto}` +
    `<span class="sp"></span>${n.t === "se" ? altrimenti(n) : ""}${elimina}</div>`;
  const dentro = lista => `<div class="dentro">${htmlLista(lista, ctx)}</div>`;

  if (n.t === "ripeti") return gruppo(testa(`<span>ripeti</span>${valore(n.id, "n", n.n + " volte")}`), dentro(n.body));
  if (n.t === "finche") return gruppo(testa(`<span>ripeti finché</span>${valore(n.id, "sens", SENSORI[n.c])}`), dentro(n.body));
  if (n.t === "sempre") return gruppo(testa(`<span>ripeti per sempre</span>`), dentro(n.body));
  if (n.t === "se") {
    const op = n.op || "base";
    const condizione = `<span>se</span>${valore(n.id, "sens", SENSORI[n.c])}` +
      valore(n.id, "op", OPERATORI[op], ' data-op="1"') +
      (op !== "base" ? valore(n.id, "sens2", SENSORI[n.c2]) : "");
    const rami = dentro(n.body) + (n.alt ? `<div class="varamo">altrimenti</div>${dentro(n.alt)}` : "");
    return gruppo(testa(condizione), rami);
  }

  return `<div class="bl ${cat}${mano}" data-id="${n.id}" data-gid="${n.id}">${presa(n.id)}` +
    `<span class="ic">${ic}</span><span>${nome}</span><span class="sp"></span>${elimina}</div>`;
}

const altrimenti = n => `<button class="x" data-alt="${n.id}">${n.alt ? "–" : "+"} altrimenti</button>`;
