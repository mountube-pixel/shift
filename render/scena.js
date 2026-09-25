/* La scena: un campo isometrico dentro un canvas. Disegna il livello,
   l'anteprima con la linea tratteggiata (ricalcolata a ogni modifica,
   è il cuore del gioco) e il replay animato con saltello e schiacciamento,
   mai a scatti. Ogni scena è autonoma: il Laboratorio ne apre tre insieme. */

import { creaPennello, LN } from "./iso.js";
import { cassa, porta, fuoco, acqua, oggetto, bandiera, robot } from "./oggetti.js";
import { traccia } from "./linea.js";
import { creaEffetti } from "./particelle.js";

const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const eo = t => t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 2); /* frenata dolce */

export function creaScena(canvas, opzioni = {}) {
  const cx = canvas.getContext("2d");
  const p = creaPennello(cx);
  const fx = creaEffetti();
  const aspetto = { fig: opzioni.fig || "rover", col: opzioni.col || "#2ee39a" };

  let L = null;          /* il livello in mostra */
  let anteprima = null;  /* la cronaca da cui nasce la linea tratteggiata */
  let replay = null;     /* la cronaca in corso di animazione */
  let iA = 0, fA = 0;    /* fotogramma corrente e frazione (0..1) verso il prossimo */
  let giaFatti = new Set(); /* fotogrammi che hanno già sparato i loro effetti */
  let finale = null;     /* il titolo di vittoria o sconfitta */
  let alPasso = () => {}, allaFine = () => {}, sottoOk = "";
  let ultimo = 0, vivo = true;

  function livello(nuovo) {
    L = nuovo; anteprima = null; replay = null; finale = null;
  }

  function mostraAnteprima(r) {
    anteprima = r;
    if (!replay) finale = null; /* una modifica spegne il titolo e ridà la linea */
  }

  function avvia(r, o = {}) {
    replay = r; iA = 0; fA = 0; giaFatti = new Set(); finale = null;
    fx.part = []; fx.testi = []; fx.coriandoli = [];
    alPasso = o.alPasso || (() => {});
    allaFine = o.allaFine || (() => {});
    sottoOk = o.sottoOk || "";
  }

  function ferma() {
    replay = null; finale = null;
    alPasso(null);
  }

  /* Fine del replay: la festa o la doccia fredda (regole del brief §8). */
  function fine() {
    const r = replay;
    replay = null;
    if (r.esito === "ok") {
      fx.boom(p.Pf, L.band[0], L.band[1], 46, "#ffd24a", 4.4);
      setTimeout(() => { if (vivo) fx.boom(p.Pf, L.band[0], L.band[1], 28, "#2ee39a", 5); }, 140);
      fx.scuoti(13);
      fx.lampeggia("#2ee39a");
      fx.sparaCoriandoli(canvas.clientWidth || 340, canvas.clientHeight || 272, 110);
      finale = { tipo: "ok", t0: performance.now(), titolo: "ARRIVATO!", sotto: sottoOk };
    } else {
      fx.scuoti(9);
      fx.lampeggia("#d63b2c");
      finale = {
        tipo: "ko", t0: performance.now(),
        titolo: r.esito === "lungo" ? "GIRA A VUOTO" : "NON CI ARRIVA",
        sotto: r.esito === "lungo" ? "il programma non finisce mai" : "finite le istruzioni",
      };
    }
    alPasso(null);
    allaFine(r);
  }

  /* Gli effetti di un fotogramma partono a metà del passo, quando l'urto
     "si sente": BONK, SPENTO!, APERTA!, la presa di un oggetto. */
  function effettiDelPasso() {
    (replay.passi[iA].fx || []).forEach(e => {
      if (e.t === "urto") { fx.boom(p.Pf, e.x, e.y, 8, "#ff8a6b", 2.2); fx.scuoti(6); fx.testo(p.Pf, e.x, e.y, "BONK", "#ff8a6b"); }
      if (e.t === "usa") { fx.boom(p.Pf, e.x, e.y, 20, "#e8f4ff", 3); fx.scuoti(5); fx.testo(p.Pf, e.x, e.y, e.e, "#bfe9ff"); }
      if (e.t === "vuoto") fx.testo(p.Pf, e.x, e.y, "niente da usare", "#d6d6e0");
      if (e.t === "presa") { fx.boom(p.Pf, e.x, e.y, 12, "#ffd24a", 2.4); fx.testo(p.Pf, e.x, e.y, e.e, "#ffd24a"); }
    });
  }

  function disegna(tm) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.clientWidth || 340;
    const H = canvas.clientHeight || W * .8;
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cielo = cx.createLinearGradient(0, 0, 0, H);
    cielo.addColorStop(0, "#171040");
    cielo.addColorStop(.55, "#3d1f66");
    cielo.addColorStop(1, "#a4456a");
    cx.fillStyle = cielo;
    cx.fillRect(0, 0, W, H);
    if (!L) return;

    const G = L.G, st = p.st;
    st.TW = Math.min(W / (G + .8), (H - 46) / (G * .5 + 2.2));
    st.TH = st.TW / 2;
    st.ZU = st.TW * .62;
    st.OX = W / 2;
    st.OY = Math.max(H * .24, (H - G * st.TH) / 2 - st.TW * .4);

    cx.save();
    if (fx.shake > .2) cx.translate((Math.random() - .5) * fx.shake, (Math.random() - .5) * fx.shake);

    /* la zolla di terra sotto il prato */
    const ang = [p.Pf(0, 0, 0), p.Pf(G, 0, 0), p.Pf(G, G, 0), p.Pf(0, G, 0)];
    const gg = ang.map(q => [q[0], q[1] + 1.1 * st.ZU]);
    p.pl([ang[3], ang[2], gg[2], gg[3]], "#4a3323", LN, 1.2);
    p.pl([ang[1], ang[2], gg[2], gg[1]], "#5d4029", LN, 1.2);
    for (let y = 0; y < G; y++) for (let x = 0; x < G; x++)
      p.tile(x, y, (x + y) % 2 ? "#3fae58" : "#379e4f", 0, true);
    (L.acqua || []).forEach(k => { const [x, y] = k.split(",").map(Number); acqua(p, x, y, tm); });

    /* lo stato in mostra: il fotogramma del replay, o il primo dell'anteprima */
    const s = replay ? replay.passi[Math.min(iA, replay.passi.length - 1)]
      : anteprima ? anteprima.passi[0] : null;
    const sp = replay ? replay.passi[Math.max(0, iA - 1)] : s;
    const fuochi = s ? s.fuoco : (L.fuoco || []);
    const porte = s ? s.porta : (L.porta || []);
    const estintori = s ? s.ogE : (L.est || []);
    const chiavi = s ? s.ogC : (L.chiave || []);
    const stivali = s ? (s.ogS || []) : (L.stivali || []);

    /* tutto ciò che ha un ingombro va disegnato da dietro in avanti */
    const og = [];
    const metti = (lista, f) => lista.forEach(k => {
      const [x, y] = k.split(",").map(Number);
      og.push({ x, y, f: () => f(x, y) });
    });
    metti(L.muri || [], (x, y) => cassa(p, x, y));
    metti(porte, (x, y) => porta(p, x, y));
    metti(fuochi, (x, y) => fuoco(p, x, y, tm));
    metti(estintori, (x, y) => oggetto(p, x, y, tm, "est"));
    metti(chiavi, (x, y) => oggetto(p, x, y, tm, "chiave"));
    metti(stivali, (x, y) => oggetto(p, x, y, tm, "stivali"));
    og.push({ x: L.band[0], y: L.band[1], f: () => bandiera(p, L.band[0], L.band[1], tm) });
    og.sort((a, b) => (a.x + a.y) - (b.x + b.y)).forEach(o => o.f());

    if (s) {
      /* la casella sotto il robot, sempre riconoscibile */
      cx.globalAlpha = .55;
      p.tile(s.x, s.y, "#2ee39a", .012);
      cx.globalAlpha = 1;
      const q = p.Pf(s.x + .5, s.y + .5, .02);
      cx.save();
      cx.translate(q[0], q[1]);
      cx.scale(1, .5);
      cx.strokeStyle = "#2ee39a";
      cx.lineWidth = 3;
      cx.globalAlpha = .9;
      cx.beginPath();
      cx.arc(0, 0, st.TW * (.40 + .04 * Math.sin(tm / 300)), 0, 7);
      cx.stroke();
      cx.restore();
      cx.globalAlpha = 1;

      /* la casella davanti: bianca se libera, rossa se il prossimo avanti sbatte */
      const d = [[0, -1], [1, 0], [0, 1], [-1, 0]][s.f];
      const nx = s.x + d[0], ny = s.y + d[1];
      if (nx >= 0 && ny >= 0 && nx < G && ny < G) {
        const c = nx + "," + ny;
        const occ = (L.muri || []).includes(c) || fuochi.includes(c) || porte.includes(c) ||
          ((L.acqua || []).includes(c) && !s.stivali);
        cx.globalAlpha = .42;
        p.tile(nx, ny, occ ? "#ff5a4a" : "#ffffff", .010);
        cx.globalAlpha = 1;
      }
    }

    if (!replay && anteprima) traccia(p, anteprima, tm);

    if (s) {
      const lerp = (a, b) => a + (b - a) * eo(fA);
      const px = replay ? lerp(sp.x, s.x) : s.x;
      const py = replay ? lerp(sp.y, s.y) : s.y;
      const mosso = replay && (sp.x !== s.x || sp.y !== s.y);
      const c0 = p.Pf(px + .5, py + .5, 0);
      const cz = p.Pf(px + .5, py + .5, mosso ? Math.sin(fA * Math.PI) * .13 : 0);
      p.ell(c0[0], c0[1], st.TW * .30, st.TH * .30, "rgba(0,0,0,.4)");
      robot(p, cz[0], cz[1], st.TW, {
        f: s.f, est: s.est, chiavi: s.chiavi, stivali: s.stivali, spia: s.spia,
        fig: aspetto.fig, col: aspetto.col, tm,
        sq: mosso ? 1 + Math.sin(fA * Math.PI) * .10 : 1,
      });
    }

    fx.disegnaMondo(cx, st);
    cx.restore();
    fx.disegnaSchermo(cx, W, H);

    /* il titolo che piomba dentro (vittoria) o entra storto (sconfitta) */
    if (finale) {
      const el = (tm - finale.t0) / 700, ok = finale.tipo === "ok";
      const k = el < 1 ? 1 + (1 - eo(cl(el, 0, 1))) * 2.2 : 1 + Math.sin(tm / 420) * .03;
      const rot = ok ? Math.sin(tm / 520) * .03 : (el < 1 ? (1 - eo(cl(el, 0, 1))) * .35 : 0);
      cx.save();
      cx.translate(W / 2, H * .44);
      cx.rotate(rot);
      cx.scale(k, k);
      cx.textAlign = "center";
      cx.font = "900 " + Math.round(Math.min(46, W * .13)) + "px sans-serif";
      cx.lineWidth = 9;
      cx.strokeStyle = "rgba(8,6,22,.85)";
      cx.strokeText(finale.titolo, 0, 0);
      const g2 = cx.createLinearGradient(0, -30, 0, 16);
      if (ok) { g2.addColorStop(0, "#b9ffe0"); g2.addColorStop(1, "#0fb57a"); }
      else { g2.addColorStop(0, "#ffc9c2"); g2.addColorStop(1, "#d63b2c"); }
      cx.fillStyle = g2;
      cx.fillText(finale.titolo, 0, 0);
      if (finale.sotto) {
        cx.font = "800 " + Math.round(Math.min(17, W * .045)) + "px sans-serif";
        cx.lineWidth = 5;
        cx.strokeStyle = "rgba(8,6,22,.8)";
        cx.strokeText(finale.sotto, 0, 26);
        cx.fillStyle = "#fff";
        cx.fillText(finale.sotto, 0, 26);
      }
      cx.restore();
    }
  }

  function giro(tm) {
    if (!vivo) return;
    requestAnimationFrame(giro);
    const dt = Math.min(64, tm - (ultimo || tm)); /* delta time: mai a scatti */
    ultimo = tm;
    fx.passo(dt, canvas.clientHeight || 300);
    if (replay) {
      fA += dt / 230;
      if (fA > .45 && !giaFatti.has(iA)) { giaFatti.add(iA); effettiDelPasso(); }
      while (fA >= 1 && replay) {
        if (iA < replay.passi.length - 1) { iA++; fA -= 1; alPasso(replay.passi[iA].id); }
        else { fA = 1; fine(); break; }
      }
    }
    disegna(tm);
  }
  requestAnimationFrame(giro);

  return {
    livello,
    anteprima: mostraAnteprima,
    avvia,
    ferma,
    inReplay: () => !!replay,
    distruggi() { vivo = false; },
  };
}
