/* Controlli di sanità sui dati di un livello. Il motore esegue quel che gli
   si dà senza validare (come il prototipo): questi controlli servono ai test
   dei livelli e agli strumenti, per trovare i dati rotti prima dei giocatori.

   Forma di un livello:
   { G: lato della griglia, start: [x,y], f: direzione 0..3, band: [x,y],
     muri/fuoco/porta/acqua/est/chiave/stivali: liste di caselle "x,y" } */

export const CHIAVI_OGGETTI = ["muri", "fuoco", "porta", "acqua", "est", "chiave", "stivali"];

export function validaLivello(L) {
  if (!L || typeof L !== "object") return ["livello mancante"];
  const errori = [];
  if (!(Number.isInteger(L.G) && L.G >= 2)) errori.push("G deve essere un intero ≥ 2");
  const dentro = p => Array.isArray(p) && p.length === 2 &&
    Number.isInteger(p[0]) && Number.isInteger(p[1]) &&
    p[0] >= 0 && p[1] >= 0 && p[0] < L.G && p[1] < L.G;
  if (!dentro(L.start)) errori.push("start fuori dalla griglia o malformato");
  if (!dentro(L.band)) errori.push("band fuori dalla griglia o malformata");
  if (![0, 1, 2, 3].includes(L.f)) errori.push("f deve essere 0..3 (nord, est, sud, ovest)");
  const occupate = {};
  for (const k of CHIAVI_OGGETTI) {
    for (const cella of L[k] || []) {
      if (!/^\d+,\d+$/.test(cella)) { errori.push(k + ": casella malformata \"" + cella + "\""); continue; }
      const [x, y] = cella.split(",").map(Number);
      if (x >= L.G || y >= L.G) errori.push(k + ": casella fuori griglia " + cella);
      if (occupate[cella]) errori.push("la casella " + cella + " è sia in " + occupate[cella] + " che in " + k);
      else occupate[cella] = k;
    }
  }
  if (errori.length) return errori;
  const solide = ["muri", "fuoco", "porta", "acqua"];
  const s = L.start.join(","), b = L.band.join(",");
  if (solide.includes(occupate[s])) errori.push("start su una casella solida (" + occupate[s] + ")");
  else if (occupate[s]) errori.push("start sopra un oggetto (" + occupate[s] + "): non verrebbe mai raccolto");
  if (solide.includes(occupate[b])) errori.push("band su una casella solida (" + occupate[b] + ")");
  return errori;
}
