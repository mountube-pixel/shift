/* Il collante della pagina: stato, eventi, e il meccanismo cardine del
   gioco. A OGNI modifica del programma il motore riesegue tutto e la linea
   tratteggiata si ridisegna, senza pulsanti intermedi. VAI apre il replay
   a schermo intero, col programma in miniatura che scorre accanto. */

import { esegui, battitiDi, contaBlocchi, SENSORI } from "../motore/indice.js";
import {
  posizioni, cursoreValido, inserisci, trova, rimuovi, dopo,
  ciclaRipetizioni, ciclaSensore, ciclaOperatore, commutaAltrimenti,
} from "./cursore.js";
import { htmlProgramma } from "./blocchi.js";
import { htmlPalette } from "./palette.js";
import { htmlTraccia, antenati, testoGiro } from "./traccia.js";
import { creaScena } from "../render/scena.js";

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
const scena = creaScena(el("stage"));

function render() {
  el("prog").innerHTML = htmlProgramma(prog, cursore);
  mappa = posizioni(prog);
}

/* Il meccanismo cardine: a ogni tocco il motore riesegue tutto e la scena
   ridisegna la linea tratteggiata; niente pulsanti intermedi. */
function calcola() {
  const verdetto = el("verdetto");
  const r = esegui(livello, prog);
  scena.anteprima(r);
  const blocchi = contaBlocchi(prog);
  const battiti = prog.length ? battitiDi(r) : "–";
  if (!prog.length || scena.inReplay()) {
    verdetto.textContent = "";
  } else if (r.esito === "ok") {
    verdetto.textContent = "la linea arriva alla bandiera · premi VAI";
    verdetto.style.color = "#2ee39a";
  } else {
    const urti = r.passi.reduce((a, p) => a + p.fx.filter(e => e.t === "urto").length, 0);
    verdetto.textContent =
      r.esito === "lungo" ? "gira a vuoto: il programma non finisce mai" :
      urti ? "sbatte " + urti + (urti === 1 ? " volta" : " volte") :
      "la linea si ferma prima";
    verdetto.style.color = "#ffd24a";
  }
  el("contatori").innerHTML =
    `<div><b>${blocchi}</b>blocchi</div><div><b>${battiti}</b>battiti</div>`;
}

function tutto() { render(); calcola(); }

/* ================= il replay a schermo intero */
const schermo = el("schermo");
let contenitori = new Map(); /* blocco → blocchi che lo contengono */
let comandiVisibili = true;

const inPieno = () => schermo.classList.contains("pieno");

function avviaReplay() {
  if (!prog.length) return;
  const r = esegui(livello, prog);
  el("prScorri").innerHTML = htmlTraccia(prog);
  el("prScorri").scrollTop = 0;
  el("prBattiti").textContent = "battito 0";
  contenitori = antenati(prog);
  schermo.classList.remove("finito");
  schermo.classList.toggle("senzaComandi", !comandiVisibili);
  schermo.classList.add("pieno");
  document.body.classList.add("inPieno");
  aggiornaMargini(true);
  scena.avvia(r, {
    alPasso: passoReplay,
    allaFine: () => schermo.classList.add("finito"),
    sottoOk: battitiDi(r) + " battiti · " + contaBlocchi(prog) + " blocchi",
  });
}

function esciPieno() {
  schermo.classList.remove("pieno", "finito");
  document.body.classList.remove("inPieno");
  scena.ferma();
  scena.margini({}, true);
  calcola();
}

/* Il campo si centra nello spazio che il pannello lascia libero. */
function aggiornaMargini(subito = false) {
  if (!inPieno() || !comandiVisibili) { scena.margini({}, subito); return; }
  const pan = el("pannelloReplay").getBoundingClientRect();
  const tutto = schermo.getBoundingClientRect();
  if (pan.height > tutto.height * .6) scena.margini({ destra: tutto.right - pan.left }, subito);
  else scena.margini({ basso: tutto.bottom - pan.top }, subito);
}

/* A ogni battito: acceso il blocco che lo produce, rischiarati quelli che
   lo contengono, giri scritti sui cicli aperti, scossa rossa se sbatte. */
function passoReplay(fotogramma, i) {
  el("prBattiti").textContent = "battito " + i;
  const cont = el("prScorri");
  cont.querySelectorAll(".tr-bl.ora, .tr-bl.antenato").forEach(b => b.classList.remove("ora", "antenato"));
  cont.querySelectorAll(".giro").forEach(g => { g.textContent = ""; });
  for (const g of fotogramma.giri) {
    const cartellino = cont.querySelector('.giro[data-giro="' + g.id + '"]');
    if (cartellino) cartellino.textContent = testoGiro(g);
  }
  for (const id of contenitori.get(fotogramma.id) || []) {
    const b = cont.querySelector('.tr-bl[data-tid="' + id + '"]');
    if (b) b.classList.add("antenato");
  }
  const riga = cont.querySelector('.tr-bl[data-tid="' + fotogramma.id + '"]');
  if (!riga) return;
  riga.classList.add("ora");
  if (fotogramma.fx.some(e => e.t === "urto")) {
    riga.classList.remove("sbatte");
    void riga.offsetWidth; /* fa ripartire l'animazione anche sullo stesso blocco */
    riga.classList.add("sbatte");
  }
  cont.scrollTo({ top: riga.offsetTop - cont.clientHeight / 2 + riga.offsetHeight / 2, behavior: "smooth" });
}

el("vai").addEventListener("click", avviaReplay);
el("rivedi").addEventListener("click", avviaReplay);
el("tornaBlocchi").addEventListener("click", esciPieno);
el("chiudiPieno").addEventListener("click", esciPieno);
el("prNascondi").addEventListener("click", () => {
  comandiVisibili = false;
  schermo.classList.add("senzaComandi");
  aggiornaMargini();
});
el("mostraComandi").addEventListener("click", () => {
  comandiVisibili = true;
  schermo.classList.remove("senzaComandi");
  aggiornaMargini();
});
addEventListener("resize", () => aggiornaMargini());
addEventListener("keydown", e => { if (e.key === "Escape" && inPieno()) esciPieno(); });

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
scena.livello(livello);
tutto();
