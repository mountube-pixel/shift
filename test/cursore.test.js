import { test } from "node:test";
import assert from "node:assert/strict";
import {
  conId, posizioni, cursoreValido, inserisci, trova, rimuovi, dopo,
  ciclaRipetizioni, ciclaSensore, ciclaOperatore, commutaAltrimenti, CICLO_RIPETI,
  dove, puoAndare, nonCambia, sposta, conSpostamento,
} from "../ui/cursore.js";

test("senza cursore il blocco va in coda e il cursore avanza", () => {
  const prog = [];
  let c = inserisci(prog, null, "avanti");
  c = inserisci(prog, c, "dx");
  assert.deepEqual(prog.map(b => b.t), ["avanti", "dx"]);
  assert.equal(c.l, prog);
  assert.equal(c.i, 2);
});

test("il cursore inserisce nel punto scelto, non in coda", () => {
  const prog = [];
  inserisci(prog, null, "avanti");
  inserisci(prog, null, "dx");
  inserisci(prog, { l: prog, i: 1 }, "sx");
  assert.deepEqual(prog.map(b => b.t), ["avanti", "sx", "dx"]);
});

test("dopo un blocco contenitore il cursore entra nel corpo", () => {
  const prog = [];
  let c = inserisci(prog, null, "ripeti");
  assert.equal(c.l, prog[0].body);
  assert.equal(c.i, 0);
  c = inserisci(prog, c, "avanti");
  assert.deepEqual(prog[0].body.map(b => b.t), ["avanti"]);
  assert.equal(c.l, prog[0].body);
});

test("ogni blocco riceve un id, anche dentro i corpi", () => {
  const prog = [];
  const c = inserisci(prog, null, "se");
  commutaAltrimenti(prog[0]);
  inserisci(prog, c, "avanti");
  inserisci(prog, { l: prog[0].alt, i: 0 }, "sx");
  const id = [prog[0].id, prog[0].body[0].id, prog[0].alt[0].id];
  assert.equal(new Set(id).size, 3);
  assert.ok(id.every(Number.isInteger));
});

test("posizioni elenca le fessure nell'ordine di disegno, altrimenti compreso", () => {
  const prog = [];
  const c = inserisci(prog, null, "se");     /* se […] */
  commutaAltrimenti(prog[0]);
  inserisci(prog, c, "avanti");              /* dentro il body */
  inserisci(prog, null, "dx");               /* in coda al programma */
  /* fessure: prima del se, dentro body (prima e dopo avanti), dentro alt,
     fra se e dx, dopo dx */
  const p = posizioni(prog);
  assert.equal(p.length, 6);
  assert.equal(p[0].l, prog); assert.equal(p[0].i, 0);
  assert.equal(p[1].l, prog[0].body);
  assert.equal(p[3].l, prog[0].alt);
  assert.deepEqual([p[5].l, p[5].i], [prog, 2]);
});

test("un cursore che punta a una lista cancellata non è più valido", () => {
  const prog = [];
  const dentro = inserisci(prog, null, "ripeti");
  assert.equal(cursoreValido(prog, dentro), true);
  rimuovi(prog, prog[0].id);
  assert.equal(cursoreValido(prog, dentro), false);
  const c = inserisci(prog, dentro, "avanti"); /* ripiega in coda */
  assert.equal(c.l, prog);
  assert.deepEqual(prog.map(b => b.t), ["avanti"]);
});

test("trova, dopo e rimuovi raggiungono anche i blocchi annidati", () => {
  const prog = [];
  const c = inserisci(prog, null, "sempre");
  inserisci(prog, c, "se");
  const se = prog[0].body[0];
  inserisci(prog, { l: se.body, i: 0 }, "avanti");
  const av = se.body[0];
  assert.equal(trova(prog, av.id), av);
  assert.deepEqual(dopo(prog, av.id), { l: se.body, i: 1 });
  assert.equal(rimuovi(prog, av.id), true);
  assert.equal(se.body.length, 0);
  assert.equal(rimuovi(prog, 99999), false);
});

test("i valori ciclano: ripetizioni, sensori del livello, operatore", () => {
  const r = { t: "ripeti", n: 3, body: [] };
  ciclaRipetizioni(r);
  assert.equal(r.n, 4);
  for (let k = 0; k < CICLO_RIPETI.length - 1; k++) ciclaRipetizioni(r);
  assert.equal(r.n, 3); /* il giro completo torna al via */

  const se = { t: "se", c: "libero", op: "base", c2: "libero", body: [], alt: null };
  ciclaSensore(se, "c", ["libero", "bloccato", "spia"]);
  assert.equal(se.c, "bloccato");
  ciclaSensore(se, "c", ["libero", "bloccato", "spia"]);
  ciclaSensore(se, "c", ["libero", "bloccato", "spia"]);
  assert.equal(se.c, "libero");

  ciclaOperatore(se);
  assert.equal(se.op, "e");
  ciclaOperatore(se);
  assert.equal(se.op, "o");
  ciclaOperatore(se);
  assert.equal(se.op, "base");
});

test("altrimenti compare e scompare con un tocco", () => {
  const se = { t: "se", c: "libero", op: "base", c2: "libero", body: [], alt: null };
  commutaAltrimenti(se);
  assert.deepEqual(se.alt, []);
  commutaAltrimenti(se);
  assert.equal(se.alt, null);
});

/* ================= spostare un blocco */

/* Costruisce un programma coi blocchi dati, tutti con un id. */
const programma = (...blocchi) => blocchi.map(conId);
const tipi = l => l.map(b => b.t);

test("sposta un blocco più avanti e più indietro nella stessa lista", () => {
  const prog = programma({ t: "avanti" }, { t: "dx" }, { t: "sx" });
  const [av, , sx] = prog;
  sposta(prog, av.id, { l: prog, i: 3 });          /* in fondo */
  assert.deepEqual(tipi(prog), ["dx", "sx", "avanti"]);
  assert.deepEqual(dove(prog, av.id), { l: prog, i: 2 });
  sposta(prog, sx.id, { l: prog, i: 0 });          /* in testa */
  assert.deepEqual(tipi(prog), ["sx", "dx", "avanti"]);
});

test("sposta dentro un ripeti e poi di nuovo fuori", () => {
  const prog = programma({ t: "avanti" }, { t: "ripeti", n: 3, body: [] });
  const [av, rip] = prog;
  const c = sposta(prog, av.id, { l: rip.body, i: 0 });
  assert.deepEqual(tipi(prog), ["ripeti"]);
  assert.deepEqual(tipi(rip.body), ["avanti"]);
  assert.deepEqual(c, { l: rip.body, i: 1 });       /* il cursore va subito dopo */
  sposta(prog, av.id, { l: prog, i: 1 });
  assert.deepEqual(tipi(prog), ["ripeti", "avanti"]);
  assert.equal(rip.body.length, 0);
});

test("un blocco con dei figli si sposta insieme a tutto quello che contiene", () => {
  const prog = programma({ t: "dx" }, { t: "ripeti", n: 2, body: [{ t: "avanti" }, { t: "sx" }] });
  const rip = prog[1];
  sposta(prog, rip.id, { l: prog, i: 0 });
  assert.deepEqual(tipi(prog), ["ripeti", "dx"]);
  assert.deepEqual(tipi(prog[0].body), ["avanti", "sx"]);
  assert.equal(prog[0], rip);                       /* lo stesso blocco, stessi id */
});

test("un blocco non può finire dentro se stesso né dentro un suo figlio", () => {
  const prog = programma({ t: "sempre", body: [{ t: "se", c: "libero", op: "base", c2: "libero", body: [], alt: [] }] });
  const sempre = prog[0], se = sempre.body[0];
  assert.equal(puoAndare(prog, sempre.id, { l: sempre.body, i: 0 }), false);
  assert.equal(puoAndare(prog, sempre.id, { l: se.alt, i: 0 }), false);
  assert.equal(sposta(prog, sempre.id, { l: se.body, i: 0 }), null);
  assert.deepEqual(tipi(prog), ["sempre"]);          /* niente è cambiato */
  assert.equal(puoAndare(prog, se.id, { l: prog, i: 1 }), true); /* il figlio può uscire */
});

test("le fessure subito prima e subito dopo un blocco lo lasciano dov'è", () => {
  const prog = programma({ t: "avanti" }, { t: "dx" }, { t: "sx" });
  const dx = prog[1];
  assert.equal(nonCambia(prog, dx.id, { l: prog, i: 1 }), true);
  assert.equal(nonCambia(prog, dx.id, { l: prog, i: 2 }), true);
  assert.equal(nonCambia(prog, dx.id, { l: prog, i: 3 }), false);
  sposta(prog, dx.id, { l: prog, i: 2 });
  assert.deepEqual(tipi(prog), ["avanti", "dx", "sx"]);
});

test("conSpostamento prova lo spostamento su una copia e lascia stare il programma vero", () => {
  const prog = programma({ t: "avanti" }, { t: "ripeti", n: 2, body: [] });
  const prima = JSON.stringify(prog);
  const k = posizioni(prog).findIndex(p => p.l === prog[1].body); /* dentro il ripeti */
  const copia = conSpostamento(prog, prog[0].id, k);
  assert.deepEqual(tipi(copia), ["ripeti"]);
  assert.deepEqual(tipi(copia[0].body), ["avanti"]);
  assert.equal(JSON.stringify(prog), prima);
  const dentroSe = posizioni(prog).findIndex(p => p.l === prog[1].body);
  assert.equal(conSpostamento(prog, prog[1].id, dentroSe), null); /* il ripeti in se stesso: no */
});
