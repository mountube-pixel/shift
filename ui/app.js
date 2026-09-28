/* Il collante della pagina: stato, eventi, e il meccanismo cardine del
   gioco. A OGNI modifica del programma il motore riesegue tutto e la linea
   tratteggiata si ridisegna, senza pulsanti intermedi. VAI apre il replay
   a schermo intero, col programma in miniatura che scorre accanto. */

import { esegui, battitiDi, contaBlocchi, SENSORI } from "../motore/indice.js";
import {
  posizioni, cursoreValido, inserisci, trova, rimuovi, dopo,
  ciclaRipetizioni, ciclaSensore, ciclaOperatore, commutaAltrimenti,
  puoAndare, nonCambia, sposta, conSpostamento,
} from "./cursore.js";
import { htmlProgramma, NOMI } from "./blocchi.js";
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

let inMano = null;       /* il blocco preso con un tocco sulla maniglia */
let trascina = null;     /* il trascinamento in corso */
let ignoraClickFino = 0; /* il click che segue un trascinamento non deve fare altro */

/* Le fessure (numeri k) dove il blocco può andare; tutte=false toglie le
   due attaccate a lui, dove lasciarlo non cambierebbe niente. */
function bersagliDi(id, tutte) {
  const k = new Set();
  posizioni(prog).forEach((p, i) => {
    if (puoAndare(prog, id, p) && (tutte || !nonCambia(prog, id, p))) k.add(i);
  });
  return k;
}

function render() {
  const avviso = inMano == null ? "" :
    `<div class="avvisoSposta"><span>Tocca una fessura verde: il blocco va lì.</span><button>annulla</button></div>`;
  const bersagli = inMano == null ? null : bersagliDi(inMano, false);
  el("prog").innerHTML = avviso + htmlProgramma(prog, cursore, { inMano, bersagli });
  mappa = posizioni(prog);
}

/* Il meccanismo cardine: a ogni tocco il motore riesegue tutto e la scena
   ridisegna la linea tratteggiata; niente pulsanti intermedi. Durante un
   trascinamento riceve il programma come sarebbe col blocco lasciato lì. */
function calcola(programma = prog) {
  const verdetto = el("verdetto");
  const r = esegui(livello, programma);
  scena.anteprima(r);
  const blocchi = contaBlocchi(programma);
  const battiti = programma.length ? battitiDi(r) : "–";
  if (!programma.length || scena.inReplay()) {
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
  if (inMano != null) { inMano = null; render(); }
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
addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (inPieno()) esciPieno();
  else if (inMano != null) { inMano = null; render(); }
});

el("palette").addEventListener("click", e => {
  const b = e.target.closest("[data-add]");
  if (!b) return;
  inMano = null;
  cursore = inserisci(prog, cursore, b.dataset.add);
  tutto();
});

el("prog").addEventListener("click", e => {
  if (performance.now() < ignoraClickFino) return;
  const maniglia = e.target.closest("[data-presa]");
  if (maniglia) {
    const id = +maniglia.dataset.presa;
    inMano = inMano === id ? null : id;
    render();
    return;
  }
  /* con un blocco in mano, il tocco dopo lo sposta o annulla */
  if (inMano != null) {
    const fessura = e.target.closest(".slot.bersaglio");
    const dest = fessura && mappa[+fessura.dataset.k];
    const dopoMossa = dest && sposta(prog, inMano, dest);
    inMano = null;
    if (dopoMossa) { cursore = dopoMossa; tutto(); } else render();
    return;
  }
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

/* ================= trascinare la maniglia
   Un solo codice per dito, mouse e penna (pointer events). Finché il dito
   non si muove di qualche pixel è un tocco, e ci pensa il click; poi il
   blocco si solleva, un fantasma lo segue, la fessura più vicina si accende
   e la linea tratteggiata mostra già il programma con il blocco lì. */
el("prog").addEventListener("pointerdown", e => {
  const maniglia = e.target.closest("[data-presa]");
  if (!maniglia || e.button > 0 || trascina) return;
  e.preventDefault(); /* niente selezione di testo col mouse */
  trascina = {
    id: +maniglia.dataset.presa, pid: e.pointerId,
    x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, attivo: false, k: null,
  };
  maniglia.setPointerCapture(e.pointerId);
});

el("prog").addEventListener("pointermove", e => {
  if (!trascina || e.pointerId !== trascina.pid) return;
  trascina.x = e.clientX;
  trascina.y = e.clientY;
  if (!trascina.attivo) {
    if (Math.hypot(e.clientX - trascina.x0, e.clientY - trascina.y0) < 8) return;
    iniziaTrascinamento();
  }
  muoviFantasma();
  scegliApprodo();
});

el("prog").addEventListener("pointerup", e => {
  if (!trascina || e.pointerId !== trascina.pid) return;
  const t = trascina;
  trascina = null;
  if (!t.attivo) return;
  ignoraClickFino = performance.now() + 400;
  chiudiTrascinamento(t);
  const dest = t.k == null ? null : mappa[t.k];
  const dopoMossa = dest && sposta(prog, t.id, dest);
  if (dopoMossa) cursore = dopoMossa;
  tutto();
});

el("prog").addEventListener("pointercancel", e => {
  if (!trascina || e.pointerId !== trascina.pid) return;
  const t = trascina;
  trascina = null;
  if (t.attivo) { chiudiTrascinamento(t); calcola(); }
});

function iniziaTrascinamento() {
  const t = trascina;
  t.attivo = true;
  if (inMano != null) { /* un tocco di prima aveva preso un blocco: vale il gesto nuovo */
    inMano = null;
    el("prog").querySelectorAll(".inMano").forEach(b => b.classList.remove("inMano"));
    el("prog").querySelectorAll(".bersaglio").forEach(b => b.classList.remove("bersaglio"));
    el("prog").querySelector(".avvisoSposta")?.remove();
  }
  document.body.classList.add("trascinando");
  const validi = bersagliDi(t.id, true);
  t.fessure = [...el("prog").querySelectorAll(".slot")].filter(f => validi.has(+f.dataset.k));
  t.gruppo = el("prog").querySelector('[data-gid="' + t.id + '"]');
  t.gruppo?.classList.add("sollevato");
  const nodo = trova(prog, t.id);
  const [ic, nome, cat] = NOMI[nodo.t];
  t.fantasma = document.createElement("div");
  t.fantasma.className = "fantasma " + cat + (contaBlocchi([nodo]) > 1 ? " conFigli" : "");
  t.fantasma.textContent = ic + " " + nome;
  document.body.appendChild(t.fantasma);
  t.raf = requestAnimationFrame(autoScorri);
}

/* il fantasma sta un po' sopra il dito, che altrimenti lo coprirebbe */
function muoviFantasma() {
  trascina.fantasma.style.transform = `translate(${trascina.x + 14}px, ${trascina.y - 30}px) rotate(-2deg)`;
}

/* La fessura valida più vicina al dito; nessuna se il dito esce dal programma. */
function scegliApprodo() {
  const t = trascina;
  const area = el("prog").getBoundingClientRect();
  const fuori = t.x < area.left - 40 || t.x > area.right + 40 || t.y < area.top - 60 || t.y > area.bottom + 60;
  let migliore = null, distanza = Infinity;
  if (!fuori) for (const f of t.fessure) {
    const r = f.getBoundingClientRect();
    const d = Math.abs(t.y - (r.top + r.height / 2));
    if (d < distanza) { distanza = d; migliore = f; }
  }
  const k = migliore ? +migliore.dataset.k : null;
  if (k === t.k) return;
  t.approdo?.classList.remove("approdo");
  migliore?.classList.add("approdo");
  t.approdo = migliore;
  t.k = k;
  calcola(k == null ? prog : conSpostamento(prog, t.id, k) || prog);
}

function chiudiTrascinamento(t) {
  cancelAnimationFrame(t.raf);
  t.fantasma?.remove();
  t.gruppo?.classList.remove("sollevato");
  t.approdo?.classList.remove("approdo");
  document.body.classList.remove("trascinando");
}

/* Vicino al bordo della fascia visibile la pagina scorre da sola, così un
   blocco può viaggiare anche in un programma lungo. */
function autoScorri() {
  const t = trascina;
  if (!t || !t.attivo) return;
  const { alto, basso } = zonaVisibile(), bordo = 56;
  let v = 0;
  if (t.y < alto + bordo) v = -Math.min(18, Math.ceil((alto + bordo - t.y) / 5));
  else if (t.y > basso - bordo) v = Math.min(18, Math.ceil((t.y - basso + bordo) / 5));
  if (v) { scrollBy(0, v); scegliApprodo(); }
  t.raf = requestAnimationFrame(autoScorri);
}

/* La fascia dove si vede il programma: sotto il campo quando il campo gli
   sta sopra (tablet in verticale), sopra la palette appiccicata in basso. */
function zonaVisibile() {
  const p = el("prog").getBoundingClientRect();
  const sopra = r => r.left < p.right && r.right > p.left;
  const campo = el("schermo").getBoundingClientRect();
  const palette = el("palette").getBoundingClientRect();
  return {
    alto: sopra(campo) ? Math.max(0, campo.bottom) : 0,
    basso: sopra(palette) ? Math.min(innerHeight, palette.top) : innerHeight,
  };
}

el("lvNome").textContent = livello.nome;
el("lvGoal").textContent = livello.goal;
el("palette").innerHTML = htmlPalette(livello.blocchi);
scena.livello(livello);
tutto();
