/* Tutto ciò che sta sopra il campo: casse (gli ostacoli bassi, mezza
   casella, così si vede sempre oltre), porta, fuoco, oggetti da
   raccogliere, acqua, bandiera e il robot. Ogni funzione prende il
   pennello della scena, così più campi convivono. */

import { LN, dk } from "./iso.js";

export function cassa(p, x, y) {
  p.cubo(x + .06, y + .06, 0, .88, .88, .46, "#c98b3f");
  p.cubo(x + .14, y + .14, .46, .72, .72, .04, "#e0a85c");
}

export function porta(p, x, y) {
  p.cubo(x + .04, y + .30, 0, .14, .42, .66, "#6d4aa8");
  p.cubo(x + .82, y + .30, 0, .14, .42, .66, "#6d4aa8");
  p.cubo(x + .18, y + .36, 0, .64, .30, .60, "#8b5cf6");
  p.cubo(x + .66, y + .62, .28, .09, .09, .09, "#ffd24a");
}

export function fuoco(p, x, y, tm) {
  const { cx, st, Pf } = p;
  const c = Pf(x + .5, y + .5, 0);
  const g = cx.createRadialGradient(c[0], c[1] - st.TW * .2, 2, c[0], c[1] - st.TW * .2, st.TW);
  g.addColorStop(0, "rgba(255,160,50,.4)");
  g.addColorStop(1, "rgba(255,120,30,0)");
  cx.fillStyle = g;
  cx.beginPath(); cx.arc(c[0], c[1] - st.TW * .2, st.TW, 0, 7); cx.fill();
  p.cubo(x + .10, y + .10, 0, .80, .80, .08, "#4a1f16");
  const fiamma = (k, col, sc) => {
    const w = Math.sin(tm / 110 + x * 2.3 + y * 1.7 + k) * .06;
    const q = Pf(x + .5, y + .5, .08 + k * .14);
    cx.beginPath();
    cx.moveTo(q[0] - st.TW * sc * .5, q[1]);
    cx.quadraticCurveTo(q[0] - st.TW * sc * .42, q[1] - st.TW * (sc + w) * .9, q[0], q[1] - st.TW * (sc + w) * 1.5);
    cx.quadraticCurveTo(q[0] + st.TW * sc * .42, q[1] - st.TW * (sc + w) * .9, q[0] + st.TW * sc * .5, q[1]);
    cx.closePath();
    cx.fillStyle = col;
    cx.fill();
  };
  fiamma(0, "#f0521f", .44); fiamma(1, "#fb923c", .30); fiamma(2, "#ffe066", .17);
}

/* L'acqua vive al livello del pavimento: una casella che ondeggia. */
export function acqua(p, x, y, tm) {
  const { cx, Pf, st } = p;
  p.tile(x, y, "#2b6fd0", .004, true);
  cx.save();
  cx.strokeStyle = "rgba(255,255,255,.5)";
  cx.lineWidth = Math.max(1.2, st.TW * .035);
  for (const k of [0, 1]) {
    const w = Math.sin(tm / 300 + x * 1.7 + y + k * 2.1) * .05;
    const a = Pf(x + .22, y + .38 + k * .28 + w, .004);
    const b = Pf(x + .58, y + .38 + k * .28 + w, .004);
    cx.beginPath();
    cx.moveTo(a[0], a[1]);
    cx.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - st.TW * .06, b[0], b[1]);
    cx.stroke();
  }
  cx.restore();
}

/* Oggetti da raccogliere: estintore, chiave, stivali. Fluttuano e brillano. */
const TINTA_OGGETTO = { est: "239,68,68", chiave: "251,191,36", stivali: "156,102,51" };

export function oggetto(p, x, y, tm, tipo) {
  const { cx, st, Pf, ell, rr } = p;
  const b = Math.sin(tm / 340 + x * 2 + y) * st.TW * .06;
  const q = Pf(x + .5, y + .5, .10), T = st.TW;
  ell(q[0], q[1] + st.TH * .16, T * .20, st.TH * .20, "rgba(0,0,0,.32)");
  const gc = TINTA_OGGETTO[tipo];
  const g = cx.createRadialGradient(q[0], q[1] - T * .2 + b, 2, q[0], q[1] - T * .2 + b, T * .55);
  g.addColorStop(0, "rgba(" + gc + ",.4)");
  g.addColorStop(1, "rgba(" + gc + ",0)");
  cx.fillStyle = g;
  cx.beginPath(); cx.arc(q[0], q[1] - T * .2 + b, T * .55, 0, 7); cx.fill();
  cx.save();
  cx.translate(q[0], q[1] - T * .18 + b);
  cx.lineWidth = 1.6;
  cx.strokeStyle = "rgba(10,7,26,.6)";
  if (tipo === "est") {
    rr(-T * .10, -T * .24, T * .20, T * .38, T * .08); cx.fillStyle = "#ef4444"; cx.fill(); cx.stroke();
    rr(-T * .08, -T * .31, T * .16, T * .08, T * .03); cx.fillStyle = "#e5e7eb"; cx.fill(); cx.stroke();
  } else if (tipo === "chiave") {
    cx.beginPath(); cx.arc(0, -T * .15, T * .10, 0, 7); cx.fillStyle = "#fbbf24"; cx.fill(); cx.stroke();
    rr(-T * .03, -T * .07, T * .06, T * .30, T * .02); cx.fillStyle = "#fbbf24"; cx.fill(); cx.stroke();
  } else { /* stivali: gambale e piede, per due */
    for (const k of [-1, 1]) {
      rr(k * T * .12 - T * .07, -T * .26, T * .14, T * .30, T * .04); cx.fillStyle = "#9c6633"; cx.fill(); cx.stroke();
      rr(k * T * .12 - T * .07, -T * .02, T * .20, T * .10, T * .04); cx.fillStyle = "#7c4f26"; cx.fill(); cx.stroke();
    }
  }
  cx.restore();
}

export function bandiera(p, x, y, tm) {
  const { cx, st, Pf } = p;
  const b = Pf(x + .5, y + .5, 0), alt = st.TW * 1.15;
  const g = cx.createRadialGradient(b[0], b[1], 2, b[0], b[1], st.TW);
  g.addColorStop(0, "rgba(255,210,74,.34)");
  g.addColorStop(1, "rgba(255,210,74,0)");
  cx.fillStyle = g;
  cx.beginPath(); cx.arc(b[0], b[1], st.TW, 0, 7); cx.fill();
  cx.strokeStyle = "rgba(10,7,26,.6)";
  cx.lineWidth = Math.max(2, st.TW * .055);
  cx.beginPath(); cx.moveTo(b[0], b[1]); cx.lineTo(b[0], b[1] - alt); cx.stroke();
  const w = Math.sin(tm / 220) * st.TW * .06;
  cx.beginPath();
  cx.moveTo(b[0], b[1] - alt);
  cx.quadraticCurveTo(b[0] + st.TW * .28, b[1] - alt + w, b[0] + st.TW * .54, b[1] - alt + st.TW * .10);
  cx.quadraticCurveTo(b[0] + st.TW * .28, b[1] - alt + st.TW * .24 + w, b[0], b[1] - alt + st.TW * .32);
  cx.closePath();
  cx.fillStyle = "#ffd24a";
  cx.fill();
  cx.lineWidth = 1.4;
  cx.stroke();
}

/* Il robot, in quattro scocche (le altre si sbloccano in Officina).
   o = { f, est, chiavi, stivali, spia, sq, col, fig, tm } */
export function robot(p, a, b, S, o) {
  const { cx, ell, rr } = p;
  const col = o.col || "#2ee39a", fig = o.fig || "rover";
  const dx = (o.f === 1 || o.f === 0) ? 1 : -1, dietro = (o.f === 0 || o.f === 3);
  const sq = o.sq || 1, W = S * .86 / sq, H = S * .60 * sq;
  cx.save();
  cx.translate(a, b);
  cx.lineJoin = "round";
  cx.lineWidth = Math.max(1.5, S * .05);
  cx.strokeStyle = "rgba(10,7,26,.68)";
  const B = (x, y, w, h, r, f) => { rr(x, y, w, h, r); cx.fillStyle = f; cx.fill(); cx.stroke(); };
  if (fig === "cingolo") {
    B(-W * .52, -H * .46, W * 1.04, H * .46, H * .17, "#333a4a");
    for (let i = 0; i < 5; i++) B(-W * .46 + i * W * .20, -H * .42, W * .10, H * .36, W * .03, "#4a5266");
    B(-W * .42, -H * .90, W * .84, H * .46, W * .10, col);
    B(-W * .26, -H * 1.20, W * .52, H * .34, W * .10, dk(col, 1.12));
  } else if (fig === "drone") {
    const hov = Math.sin((o.tm || 0) / 180) * S * .03;
    cx.translate(0, hov);
    for (const k of [-1, 1]) {
      B(k * W * .42 - W * .09, -H * .98, W * .18, H * .16, W * .06, "#4b5162");
      cx.save(); cx.globalAlpha = .4; cx.fillStyle = "#cfe9ff";
      cx.beginPath(); cx.ellipse(k * W * .42, -H * 1.04, W * .28, W * .05, 0, 0, 7); cx.fill(); cx.restore();
    }
    B(-W * .36, -H * .96, W * .72, H * .60, W * .24, col);
    B(-W * .26, -H * 1.18, W * .52, H * .26, W * .10, dk(col, 1.12));
  } else if (fig === "quad") {
    for (const k of [-1, 1]) for (const j of [-1, 1]) {
      ell(k * W * .38, -H * .14 + j * H * .05, S * .10, S * .10, "#2b3140");
      cx.beginPath(); cx.arc(k * W * .38, -H * .14 + j * H * .05, S * .10, 0, 7); cx.stroke();
    }
    B(-W * .44, -H * .72, W * .88, H * .50, W * .14, col);
    B(-W * .24, -H * 1.06, W * .48, H * .34, W * .12, dk(col, 1.12));
  } else { /* rover */
    for (const k of [-1, 1]) {
      ell(k * W * .36, -H * .16, S * .13, S * .13, "#2b3140");
      cx.beginPath(); cx.arc(k * W * .36, -H * .16, S * .13, 0, 7); cx.stroke();
      ell(k * W * .36, -H * .16, S * .05, S * .05, "#7b8497");
    }
    cx.beginPath();
    cx.moveTo(-W * .46, -H * .28); cx.lineTo(-W * .34, -H * .88);
    cx.lineTo(W * .34, -H * .88); cx.lineTo(W * .46, -H * .28);
    cx.closePath();
    cx.fillStyle = col; cx.fill(); cx.stroke();
    B(-W * .28, -H * 1.18, W * .56, H * .34, W * .10, dk(col, 1.14));
  }
  /* il visore: davanti brilla, di spalle è un pannello scuro */
  if (!dietro) {
    const x = dx > 0 ? -W * .12 : -W * .24;
    rr(x, -H * 1.10, W * .36, H * .18, H * .08);
    const g = cx.createLinearGradient(x, -H * 1.10, x + W * .36, -H * .92);
    g.addColorStop(0, "#eafcff"); g.addColorStop(.5, "#25e0ff"); g.addColorStop(1, "#0a6b8f");
    cx.fillStyle = g; cx.fill(); cx.stroke();
  } else B(-W * .18, -H * 1.10, W * .36, H * .18, W * .06, dk(col, .6));
  /* l'antenna con la spia: la memoria del robot, sempre in vista */
  cx.beginPath(); cx.moveTo(dx * W * .20, -H * 1.18); cx.lineTo(dx * W * .26, -H * 1.48); cx.stroke();
  ell(dx * W * .26, -H * 1.52, S * .055, S * .055, o.spia ? "#ffe066" : "#6b7280");
  if (o.spia) { cx.save(); cx.globalAlpha = .5; ell(dx * W * .26, -H * 1.52, S * .13, S * .13, "#ffe066"); cx.restore(); }
  /* lo zaino: quello che ha raccolto si vede addosso */
  let ox = dx > 0 ? W * .42 : -W * .60;
  if (o.est > 0) { B(ox, -H * .60, W * .18, H * .34, W * .07, "#ef4444"); ox += dx * W * .22; }
  if (o.chiavi > 0) { B(ox, -H * .52, W * .16, H * .20, W * .06, "#fbbf24"); ox += dx * W * .22; }
  if (o.stivali) B(ox, -H * .56, W * .16, H * .26, W * .06, "#9c6633");
  cx.restore();
}
