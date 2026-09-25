/* Gli effetti: scoppi di particelle, scritte che salgono, coriandoli,
   lampo a tutto schermo e scossa della camera. Ogni scena ha i suoi. */

const cl = (v, a, b) => Math.max(a, Math.min(b, v));

export function creaEffetti() {
  const fx = {
    part: [], testi: [], coriandoli: [], lampo: null, shake: 0,

    /* uno scoppio di n particelle nel punto di gioco (x,y); pf proietta */
    boom(pf, x, y, n, col, sp) {
      const c = pf(x + .5, y + .5, .25);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 7, v = (.4 + Math.random()) * sp;
        fx.part.push({ x: c[0], y: c[1], vx: Math.cos(a) * v, vy: Math.sin(a) * v * .55 - v * .5, l: 1, col });
      }
    },

    testo(pf, x, y, t, col) {
      const c = pf(x + .5, y + .5, .9);
      fx.testi.push({ x: c[0], y: c[1], t, col, l: 1 });
    },

    sparaCoriandoli(W, H, n) {
      for (let i = 0; i < n; i++) fx.coriandoli.push({
        x: Math.random() * W, y: -20 - Math.random() * H * .6,
        vx: (Math.random() - .5) * 2.4, vy: 2 + Math.random() * 3.4,
        r: 3 + Math.random() * 5, a: Math.random() * 7,
        va: (Math.random() - .5) * .3, l: 1,
        col: ["#2ee39a", "#ffd24a", "#ff6fae", "#3dbdf5", "#ffb43b", "#c3f53d"][i % 6],
      });
    },

    lampeggia(col) { fx.lampo = { col, l: 1 }; },
    scuoti(v) { fx.shake = Math.max(fx.shake, v); },

    /* avanza tutto di dt millisecondi (delta time: i tablet lenti contano) */
    passo(dt, H) {
      fx.coriandoli = fx.coriandoli.filter(c => {
        c.x += c.vx; c.y += c.vy; c.vy += .035; c.a += c.va; c.l -= .0035;
        return c.l > 0 && c.y < H + 40;
      });
      if (fx.lampo) { fx.lampo.l -= dt * .0018; if (fx.lampo.l <= 0) fx.lampo = null; }
      fx.part = fx.part.filter(q => {
        q.x += q.vx * dt * .06; q.y += q.vy * dt * .06; q.vy += dt * .012; q.l -= dt * .0024;
        return q.l > 0;
      });
      fx.testi = fx.testi.filter(t => { t.y -= dt * .035; t.l -= dt * .0015; return t.l > 0; });
      fx.shake *= Math.pow(.9, dt / 16);
    },

    /* particelle e scritte vivono nel mondo (tremano con la scossa) */
    disegnaMondo(cx, st) {
      fx.part.forEach(q => {
        cx.globalAlpha = cl(q.l, 0, 1);
        cx.fillStyle = q.col;
        cx.beginPath(); cx.arc(q.x, q.y, 2 + q.l * 2.4, 0, 7); cx.fill();
      });
      cx.globalAlpha = 1;
      fx.testi.forEach(t => {
        cx.globalAlpha = cl(t.l * 1.4, 0, 1);
        cx.textAlign = "center";
        cx.font = "900 " + Math.round(st.TW * .4) + "px sans-serif";
        cx.lineWidth = 4;
        cx.strokeStyle = "rgba(10,7,26,.75)";
        cx.strokeText(t.t, t.x, t.y);
        cx.fillStyle = t.col;
        cx.fillText(t.t, t.x, t.y);
      });
      cx.globalAlpha = 1;
    },

    /* coriandoli e lampo stanno sopra tutto, fermi rispetto allo schermo */
    disegnaSchermo(cx, W, H) {
      fx.coriandoli.forEach(c => {
        cx.save();
        cx.globalAlpha = cl(c.l, 0, 1);
        cx.translate(c.x, c.y);
        cx.rotate(c.a);
        cx.fillStyle = c.col;
        cx.fillRect(-c.r / 2, -c.r / 2, c.r, c.r * 1.7);
        cx.restore();
      });
      if (fx.lampo) {
        cx.save();
        cx.globalAlpha = cl(fx.lampo.l, 0, 1) * .45;
        cx.fillStyle = fx.lampo.col;
        cx.fillRect(0, 0, W, H);
        cx.restore();
      }
    },
  };
  return fx;
}
