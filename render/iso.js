/* La proiezione isometrica e le primitive di disegno.
   Un "pennello" lega un contesto canvas al suo stato di camera (st):
   ogni scena ha il proprio, così più campi possono vivere insieme
   (il Laboratorio ne mostra tre). Formule identiche al prototipo. */

export const LN = "rgba(10,7,26,.55)"; /* il colore delle linee di contorno */

/* Scurisce (k<1) o schiarisce (k>1) un colore #rrggbb: le facce dei cubi. */
export const dk = (h, k) => {
  const n = parseInt(h.slice(1), 16);
  return "rgb(" + Math.round((n >> 16 & 255) * k) + "," +
    Math.round((n >> 8 & 255) * k) + "," + Math.round((n & 255) * k) + ")";
};

export function creaPennello(cx) {
  /* TW/TH: larghezza e altezza di una casella; ZU: unità verticale;
     OX/OY: dove cade l'origine della griglia sullo schermo. */
  const st = { TW: 0, TH: 0, ZU: 0, OX: 0, OY: 0 };

  /* Da coordinate di gioco (x, y, quota z) a pixel. */
  const Pf = (x, y, z) => [st.OX + (x - y) * st.TW / 2, st.OY + (x + y) * st.TH / 2 - (z || 0) * st.ZU];

  const pl = (p, fill, stroke, lw) => {
    cx.beginPath();
    cx.moveTo(p[0][0], p[0][1]);
    for (let i = 1; i < p.length; i++) cx.lineTo(p[i][0], p[i][1]);
    cx.closePath();
    if (fill) { cx.fillStyle = fill; cx.fill(); }
    if (stroke) { cx.strokeStyle = stroke; cx.lineWidth = lw || 1.1; cx.lineJoin = "round"; cx.stroke(); }
  };

  const tile = (x, y, col, z, contorno) =>
    pl([Pf(x, y, z), Pf(x + 1, y, z), Pf(x + 1, y + 1, z), Pf(x, y + 1, z)], col, contorno ? LN : null, 1);

  /* Un parallelepipedo appoggiato sulla griglia: la base degli ostacoli. */
  const cubo = (x, y, z, w, d, h, col) => {
    if (h <= .002) return;
    pl([Pf(x, y + d, z), Pf(x + w, y + d, z), Pf(x + w, y + d, z + h), Pf(x, y + d, z + h)], dk(col, .55), LN);
    pl([Pf(x + w, y, z), Pf(x + w, y + d, z), Pf(x + w, y + d, z + h), Pf(x + w, y, z + h)], dk(col, .78), LN);
    pl([Pf(x, y, z + h), Pf(x + w, y, z + h), Pf(x + w, y + d, z + h), Pf(x, y + d, z + h)], col, LN);
  };

  const ell = (a, b, r1, r2, col, al) => {
    cx.save();
    cx.globalAlpha = al === undefined ? 1 : al;
    cx.fillStyle = col;
    cx.beginPath();
    cx.ellipse(a, b, r1, r2, 0, 0, 7);
    cx.fill();
    cx.restore();
  };

  const rr = (x, y, w, h, r) => {
    r = Math.min(r, w / 2, h / 2);
    cx.beginPath();
    cx.moveTo(x + r, y);
    cx.arcTo(x + w, y, x + w, y + h, r);
    cx.arcTo(x + w, y + h, x, y + h, r);
    cx.arcTo(x, y + h, x, y, r);
    cx.arcTo(x, y, x + w, y, r);
    cx.closePath();
  };

  return { cx, st, Pf, pl, tile, cubo, ell, rr };
}
