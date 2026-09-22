/* Il collante della pagina: stato, eventi, e il meccanismo cardine del
   gioco. A OGNI modifica del programma il motore riesegue tutto e la pagina
   risponde subito, senza pulsanti intermedi: per ora con verdetto e
   contatori, dal punto 3 con la linea tratteggiata disegnata sul campo. */

import { esegui, battitiDi, contaBlocchi, SENSORI } from "../motore/indice.js";
import {
  posizioni, cursoreValido, inserisci, trova, rimuovi, dopo,
  ciclaRipetizioni, ciclaSensore, ciclaOperatore, commutaAltrimenti,
} from "./cursore.js";
import { htmlProgramma } from "./blocchi.js";
import { htmlPalette } from "./palette.js";

/* Livello provvisorio per provare ogni blocco: i livelli veri arrivano col
   punto 4 dell'ordine di lavoro, in /livelli. */
const CAMPO_PROVA = {
  nome: "campo prova",
  goal: "Prova i blocchi: il campo risponde a ogni modifica.",
  G: 7, start: [1, 3], f: 1, band: [5, 3],
  muri: ["3,2", "3,4"], fuoco: ["3,3"], est: ["1,1"],
  blocchi: ["avanti", "dx", "sx", "usa", "aspetta", "accendi", "spegnispia", "ripeti", "finche", "se", "sempre"],
  sensori: Object.keys(SENSORI),
};

let livello = CAMPO_PROVA;
let prog = [];
let cursore = null;
let mappa = []; /* posizione k → {l, i}, nello stesso ordine dei data-k */

const el = id => document.getElementById(id);

function render() {
  el("prog").innerHTML = htmlProgramma(prog, cursore);
  mappa = posizioni(prog);
}

/* Il verdetto racconta cosa farebbe il robot, ricalcolato a ogni tocco. */
function calcola() {
  const verdetto = el("verdetto");
  const blocchi = contaBlocchi(prog);
  let battiti = "–";
  if (!prog.length) {
    verdetto.textContent = "";
  } else {
    const r = esegui(livello, prog);
    battiti = battitiDi(r);
    const urti = r.passi.reduce((a, p) => a + p.fx.filter(e => e.t === "urto").length, 0);
    if (r.esito === "ok") {
      verdetto.textContent = "arriva alla bandiera · " + battiti + " battiti";
      verdetto.style.color = "#2ee39a";
    } else {
      verdetto.textContent =
        r.esito === "lungo" ? "gira a vuoto: il programma non finisce mai" :
        urti ? "sbatte " + urti + (urti === 1 ? " volta" : " volte") :
        "si ferma prima della bandiera";
      verdetto.style.color = "#ffd24a";
    }
  }
  el("contatori").innerHTML =
    `<div><b>${blocchi}</b>blocchi</div><div><b>${battiti}</b>battiti</div>`;
}

function tutto() { render(); calcola(); }

el("palette").addEventListener("click", e => {
  const b = e.target.closest("[data-add]");
  if (!b) return;
  cursore = inserisci(prog, cursore, b.dataset.add);
  tutto();
});

el("prog").addEventListener("click", e => {
  const val = e.target.closest("[data-cicla]");
  if (val) {
    const n = trova(prog, +val.dataset.id);
    if (!n) return;
    const come = val.dataset.cicla;
    if (come === "n") ciclaRipetizioni(n);
    else if (come === "sens") ciclaSensore(n, "c", livello.sensori);
    else if (come === "sens2") ciclaSensore(n, "c2", livello.sensori);
    else if (come === "op") ciclaOperatore(n);
    tutto();
    return;
  }
  const fessura = e.target.closest(".slot");
  if (fessura) {
    cursore = mappa[+fessura.dataset.k] || null;
    render();
    return;
  }
  const alt = e.target.closest("[data-alt]");
  if (alt) {
    const n = trova(prog, +alt.dataset.alt);
    if (n) { commutaAltrimenti(n); tutto(); }
    return;
  }
  const rm = e.target.closest("[data-rm]");
  if (rm) {
    rimuovi(prog, +rm.dataset.rm);
    if (!cursoreValido(prog, cursore)) cursore = null;
    tutto();
    return;
  }
  const blocco = e.target.closest(".bl[data-id]");
  if (blocco) {
    cursore = dopo(prog, +blocco.dataset.id);
    render();
  }
});

el("lvNome").textContent = livello.nome;
el("lvGoal").textContent = livello.goal;
el("palette").innerHTML = htmlPalette(livello.blocchi);
tutto();
