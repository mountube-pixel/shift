/* La linea tratteggiata: il cuore di tutto il gioco.
   Disegna il percorso che il robot farà, una X rossa dove sbatterebbe,
   e un cerchio sul punto in cui si fermerà: verde se è la bandiera,
   giallo se il programma si spegne prima. */

export function traccia(p, anteprima, tm) {
  const { cx, st, Pf } = p;
  if (anteprima.passi.length < 2) return;
  const pts = anteprima.passi.map(q => Pf(q.x + .5, q.y + .5, .04));
  cx.save();
  cx.setLineDash([7, 6]);
  cx.lineDashOffset = -(tm / 28) % 13; /* il tratteggio cammina: si capisce il verso */
  cx.strokeStyle = "rgba(255,255,255,.85)";
  cx.lineWidth = Math.max(2.5, st.TW * .075);
  cx.lineJoin = "round";
  cx.lineCap = "round";
  cx.beginPath();
  cx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) cx.lineTo(pts[i][0], pts[i][1]);
  cx.stroke();
  cx.setLineDash([]);

  anteprima.passi.forEach(q => q.fx.forEach(e => {
    if (e.t !== "urto") return;
    const c = Pf(e.x + .5, e.y + .5, .06);
    cx.strokeStyle = "#ff5a4a";
    cx.lineWidth = Math.max(3, st.TW * .09);
    const r = st.TW * .20;
    cx.beginPath();
    cx.moveTo(c[0] - r, c[1] - r * .5); cx.lineTo(c[0] + r, c[1] + r * .5);
    cx.moveTo(c[0] + r, c[1] - r * .5); cx.lineTo(c[0] - r, c[1] + r * .5);
    cx.stroke();
  }));

  const f = anteprima.passi[anteprima.passi.length - 1];
  const q = Pf(f.x + .5, f.y + .5, .05);
  cx.strokeStyle = anteprima.esito === "ok" ? "#2ee39a" : "#ffd24a";
  cx.lineWidth = 3;
  cx.save();
  cx.translate(q[0], q[1]);
  cx.scale(1, .5);
  cx.beginPath();
  cx.arc(0, 0, st.TW * (.34 + .05 * Math.sin(tm / 220)), 0, 7);
  cx.stroke();
  cx.restore();
  cx.restore();
}
