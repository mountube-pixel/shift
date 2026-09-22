/* Il percorso ottimo in azioni (avanti/gira) trovato con una visita in
   ampiezza sugli stati (x, y, direzione). Considera solo i muri, non gli
   attrezzi: serve per il par in battiti delle arene e per il bot, che
   corrono su tracciati senza fuochi né porte. */

import { DIRS } from "./esegui.js";

export function ottimo(L) {
  const G = L.G, mu = new Set(L.muri || []);
  const bloc = (x, y) => x < 0 || y < 0 || x >= G || y >= G || mu.has(x + "," + y);
  const chiave = (x, y, f) => x + "," + y + "," + f;
  const p0 = { x: L.start[0], y: L.start[1], f: L.f };
  const visti = new Set([chiave(p0.x, p0.y, p0.f)]);
  const coda = [{ ...p0, az: [] }];
  let testa = 0;
  while (testa < coda.length) {
    const c = coda[testa++];
    if (c.x === L.band[0] && c.y === L.band[1]) return c.az;
    const d = DIRS[c.f], nx = c.x + d[0], ny = c.y + d[1];
    const mosse = [];
    if (!bloc(nx, ny)) mosse.push({ x: nx, y: ny, f: c.f, a: "avanti" });
    mosse.push({ x: c.x, y: c.y, f: (c.f + 1) % 4, a: "dx" });
    mosse.push({ x: c.x, y: c.y, f: (c.f + 3) % 4, a: "sx" });
    for (const mv of mosse) {
      const k = chiave(mv.x, mv.y, mv.f);
      if (visti.has(k)) continue;
      visti.add(k);
      coda.push({ x: mv.x, y: mv.y, f: mv.f, az: c.az.concat(mv.a) });
    }
  }
  return null; /* la bandiera non è raggiungibile */
}
