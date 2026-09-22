/* L'interprete: esegue un programma su un livello e produce la cronaca,
   cioè la lista dei fotogrammi che la linea tratteggiata e il replay
   disegnano. È la parte che non può divergere fra dispositivi: stesso
   programma + stesso livello = stessa identica cronaca, sempre. Per questo
   i limiti qui sotto fanno parte del formato sfida (v1) quanto i nomi dei
   blocchi: cambiarli cambia i replay, e impone di alzare la versione. */

/* Le quattro direzioni: 0 nord (y-1), 1 est (x+1), 2 sud (y+1), 3 ovest (x-1). */
export const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];

export const LIMITI = {
  passi: 900,   /* azioni + letture di sensore per l'intera esecuzione */
  finche: 400,  /* giri di un singolo "ripeti finché" */
  sempre: 2000, /* giri di un singolo "ripeti per sempre" */
};

/* Srotola il programma in una sequenza di richieste: {az} per un'azione,
   {chiedi} per una condizione da valutare (la risposta arriva via next()). */
function* passiDi(lista) {
  for (const n of lista) {
    if (n.t === "ripeti") {
      for (let i = 0; i < n.n; i++) yield* passiDi(n.body);
    } else if (n.t === "sempre") {
      if (!n.body.length) continue;
      let g = 0;
      while (g++ < LIMITI.sempre) yield* passiDi(n.body);
    } else if (n.t === "finche") {
      /* ripete MENTRE il sensore è vero; la guardia si valuta prima di ogni giro */
      let g = 0;
      while (yield { chiedi: n, id: n.id }) {
        if (g++ > LIMITI.finche) break;
        yield* passiDi(n.body);
      }
    } else if (n.t === "se") {
      const v = yield { chiedi: n, id: n.id };
      if (v) yield* passiDi(n.body);
      else if (n.alt) yield* passiDi(n.alt);
    } else yield { az: n.t, id: n.id };
  }
}

/* Esegue e ritorna {passi, esito, G}.
   passi[0] è lo stato di partenza; ogni azione aggiunge un fotogramma, quindi
   i battiti sono passi.length-1: ogni azione eseguita costa un battito, anche
   un avanti che sbatte, un attrezzo usato a vuoto, un'attesa o la spia.
   esito: "ok" toccata la bandiera (l'esecuzione si ferma lì),
          "finito" programma terminato prima della bandiera,
          "lungo" superato il tetto di passi (gira a vuoto). */
export function esegui(L, programma, max = LIMITI.passi) {
  const G = L.G;
  const m = {};
  for (const k of ["muri", "fuoco", "porta", "acqua", "est", "chiave", "stivali"])
    m[k] = new Set(L[k] || []);
  const me = { x: L.start[0], y: L.start[1], f: L.f, est: 0, chiavi: 0, stivali: false, spia: false };
  const band = { x: L.band[0], y: L.band[1] };
  /* quante volte il robot è ENTRATO in ogni casella; la partenza conta 1 */
  const visite = { [me.x + "," + me.y]: 1 };

  const davanti = () => { const d = DIRS[me.f]; return { x: me.x + d[0], y: me.y + d[1] }; };
  const lato = k => { const d = DIRS[(me.f + k) % 4]; return { x: me.x + d[0], y: me.y + d[1] }; };
  /* una casella blocca il passo se è fuori campo, muro, fuoco, porta chiusa,
     o acqua quando il robot non ha gli stivali */
  const bloc = p => p.x < 0 || p.y < 0 || p.x >= G || p.y >= G ||
    m.muri.has(p.x + "," + p.y) || m.fuoco.has(p.x + "," + p.y) || m.porta.has(p.x + "," + p.y) ||
    (m.acqua.has(p.x + "," + p.y) && !me.stivali);

  /* La meta vista dal muso del robot: il vettore verso la bandiera si ruota
     nel sistema di riferimento del robot e vince l'asse con la componente
     più lunga; a parità vince l'asse davanti/dietro. */
  const bussola = () => {
    const dx = band.x - me.x, dy = band.y - me.y;
    const gira = (f, ax, ay) =>
      f === 0 ? [ax, ay] : f === 1 ? [ay, -ax] : f === 2 ? [-ax, -ay] : [-ay, ax];
    const [rx, ry] = gira(me.f, dx, dy);
    if (rx === 0 && ry === 0) return "metaDavanti";
    if (Math.abs(ry) >= Math.abs(rx)) return ry < 0 ? "metaDavanti" : "metaDietro";
    return rx > 0 ? "metaDestra" : "metaSinistra";
  };

  const sensore = q => {
    if (q === "libero") return !bloc(davanti());
    if (q === "bloccato") return bloc(davanti());
    if (q === "dxLibera") return !bloc(lato(1));
    if (q === "dxMuro") return bloc(lato(1));
    if (q === "sxLibera") return !bloc(lato(3));
    if (q === "sxMuro") return bloc(lato(3));
    if (q === "dietroLibero") return !bloc(lato(2));
    if (q === "giaPassato") return (visite[me.x + "," + me.y] || 0) > 1;
    if (q === "nuovoDavanti") { const p = davanti(); return !bloc(p) && !visite[p.x + "," + p.y]; }
    if (q === "spia") return me.spia;
    if (q === "fuocoDavanti") { const p = davanti(); return m.fuoco.has(p.x + "," + p.y); }
    if (q === "portaDavanti") { const p = davanti(); return m.porta.has(p.x + "," + p.y); }
    if (q === "acquaDavanti") { const p = davanti(); return m.acqua.has(p.x + "," + p.y); }
    if (q === "hoEstintore") return me.est > 0;
    if (q === "hoChiave") return me.chiavi > 0;
    if (q === "hoStivali") return me.stivali;
    if (q.indexOf("meta") === 0) return bussola() === q;
    return false;
  };

  /* ogni fotogramma porta lo stato completo, così il replay può partire da
     qualunque punto; l'acqua non cambia mai, quindi resta sul livello */
  const fotografa = (id, fx) => ({
    x: me.x, y: me.y, f: me.f, id, fx,
    est: me.est, chiavi: me.chiavi, stivali: me.stivali, spia: me.spia,
    fuoco: [...m.fuoco], porta: [...m.porta],
    ogE: [...m.est], ogC: [...m.chiave], ogS: [...m.stivali],
  });

  const cronaca = [fotografa(null, [])];
  let esito = null;
  const it = passiDi(programma);
  let risposta;
  for (let k = 0; k < max; k++) {
    const r = it.next(risposta);
    risposta = undefined;
    if (r.done) { esito = "finito"; break; }
    const s = r.value;
    if (s.chiedi !== undefined) {
      /* anche leggere i sensori consuma il tetto di passi, così un programma
         di soli controlli non gira in eterno */
      const n0 = s.chiedi;
      const a = sensore(n0.c);
      if (!n0.op || n0.op === "base") risposta = a;
      else if (n0.op === "e") risposta = a && sensore(n0.c2);
      else risposta = a || sensore(n0.c2);
      continue;
    }
    const fx = [];
    if (s.az === "dx") me.f = (me.f + 1) % 4;
    else if (s.az === "sx") me.f = (me.f + 3) % 4;
    else if (s.az === "accendi") me.spia = true;
    else if (s.az === "spegnispia") me.spia = false;
    else if (s.az === "aspetta") { /* un battito senza fare niente */ }
    else if (s.az === "usa") {
      const p = davanti(), c = p.x + "," + p.y;
      if (m.fuoco.has(c) && me.est > 0) {
        m.fuoco.delete(c); me.est--;
        fx.push({ t: "usa", x: p.x, y: p.y, e: "SPENTO!" });
      } else if (m.porta.has(c) && me.chiavi > 0) {
        m.porta.delete(c); me.chiavi--;
        fx.push({ t: "usa", x: p.x, y: p.y, e: "APERTA!" });
      } else fx.push({ t: "vuoto", x: p.x, y: p.y });
    } else { /* avanti */
      const p = davanti(), c = p.x + "," + p.y;
      /* contro un ostacolo il robot resta fermo e il programma continua */
      if (bloc(p)) fx.push({ t: "urto", x: p.x, y: p.y });
      else {
        me.x = p.x; me.y = p.y;
        visite[c] = (visite[c] || 0) + 1;
        if (m.est.has(c)) { m.est.delete(c); me.est++; fx.push({ t: "presa", x: p.x, y: p.y, e: "🧯" }); }
        if (m.chiave.has(c)) { m.chiave.delete(c); me.chiavi++; fx.push({ t: "presa", x: p.x, y: p.y, e: "🗝" }); }
        if (m.stivali.has(c)) { m.stivali.delete(c); me.stivali = true; fx.push({ t: "presa", x: p.x, y: p.y, e: "🥾" }); }
      }
    }
    cronaca.push(fotografa(s.id ?? null, fx));
    if (me.x === band.x && me.y === band.y) { esito = "ok"; break; }
  }
  if (!esito) esito = "lungo";
  return { passi: cronaca, esito, G };
}

/* I battiti di un'esecuzione: il fotogramma di partenza non conta. */
export const battitiDi = r => r.passi.length - 1;
