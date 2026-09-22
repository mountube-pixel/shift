/* Il cursore di inserimento: la prima regola dell'interfaccia.
   Niente trascinamento: si tocca una fessura per dire DOVE, un blocco della
   palette per dire COSA, e il blocco compare lì. Questo modulo è puro (zero
   DOM): la vista disegna le fessure nell'ordine di posizioni() e riferisce
   qui ogni tocco. */

import { nuovoBlocco } from "../motore/indice.js";

let UID = 1;

/* Dà un id al blocco e a tutto ciò che contiene. Gli id servono alla vista
   per evidenziare, ciclare i valori e cancellare; il motore li ignora. */
export function conId(n) {
  n.id = UID++;
  (n.body || []).forEach(conId);
  (n.alt || []).forEach(conId);
  return n;
}

/* Tutte le posizioni in cui il cursore può stare, nell'ordine in cui la
   vista disegna le fessure: prima di ogni blocco, dentro i corpi (body e
   altrimenti compresi), e in coda a ogni lista. Un cursore è {l, i}:
   la lista che lo ospita e l'indice dentro di lei. */
export function posizioni(prog) {
  const out = [];
  const cammina = l => {
    for (let i = 0; i < l.length; i++) {
      out.push({ l, i });
      if (l[i].body) cammina(l[i].body);
      if (l[i].alt) cammina(l[i].alt);
    }
    out.push({ l, i: l.length });
  };
  cammina(prog);
  return out;
}

/* Il cursore resta valido finché la sua lista appartiene al programma
   (dopo una cancellazione potrebbe non esserci più). */
export function cursoreValido(prog, cursore) {
  if (!cursore || cursore.i < 0 || cursore.i > cursore.l.length) return false;
  if (cursore.l === prog) return true;
  return posizioni(prog).some(p => p.l === cursore.l);
}

/* Inserisce un blocco nuovo del tipo chiesto: al cursore se è valido,
   in coda al programma altrimenti. Ritorna il cursore dopo l'inserimento:
   dentro il corpo se il blocco può contenere altri blocchi (così il
   prossimo tocco finisce lì), subito dopo negli altri casi. */
export function inserisci(prog, cursore, tipo) {
  const n = conId(nuovoBlocco(tipo));
  const c = cursoreValido(prog, cursore) ? cursore : { l: prog, i: prog.length };
  c.l.splice(c.i, 0, n);
  return n.body ? { l: n.body, i: 0 } : { l: c.l, i: c.i + 1 };
}

/* Cerca un blocco per id, anche in fondo ai corpi annidati. */
export function trova(prog, id) {
  for (const n of prog) {
    if (n.id === id) return n;
    if (n.body) { const r = trova(n.body, id); if (r) return r; }
    if (n.alt) { const r = trova(n.alt, id); if (r) return r; }
  }
  return null;
}

/* Toglie il blocco con quell'id (e tutto ciò che contiene). */
export function rimuovi(prog, id) {
  for (let i = 0; i < prog.length; i++) {
    if (prog[i].id === id) { prog.splice(i, 1); return true; }
    if (prog[i].body && rimuovi(prog[i].body, id)) return true;
    if (prog[i].alt && rimuovi(prog[i].alt, id)) return true;
  }
  return false;
}

/* La posizione subito dopo un blocco: toccare un blocco porta lì il cursore. */
export function dopo(prog, id) {
  for (let i = 0; i < prog.length; i++) {
    if (prog[i].id === id) return { l: prog, i: i + 1 };
    if (prog[i].body) { const r = dopo(prog[i].body, id); if (r) return r; }
    if (prog[i].alt) { const r = dopo(prog[i].alt, id); if (r) return r; }
  }
  return null;
}

/* I parametri non hanno menu: si toccano e ciclano fra le opzioni. */
export const CICLO_RIPETI = [2, 3, 4, 5, 6, 8, 10];

export function ciclaRipetizioni(nodo) {
  nodo.n = CICLO_RIPETI[(CICLO_RIPETI.indexOf(nodo.n) + 1) % CICLO_RIPETI.length];
}

/* campo è "c" o "c2"; lista sono i sensori disponibili nel livello, così i
   sensori non ancora insegnati non compaiono nemmeno nel giro. */
export function ciclaSensore(nodo, campo, lista) {
  const k = lista.indexOf(nodo[campo]);
  nodo[campo] = lista[(k + 1) % lista.length];
}

export const CICLO_OPERATORI = ["base", "e", "o"];

export function ciclaOperatore(nodo) {
  const k = CICLO_OPERATORI.indexOf(nodo.op || "base");
  nodo.op = CICLO_OPERATORI[(k + 1) % CICLO_OPERATORI.length];
}

/* Il ramo «altrimenti» di un se compare e scompare con un tocco. */
export function commutaAltrimenti(nodo) {
  nodo.alt = nodo.alt ? null : [];
}
