import { test } from "node:test";
import assert from "node:assert/strict";
import {
  conId, posizioni, cursoreValido, inserisci, trova, rimuovi, dopo,
  ciclaRipetizioni, ciclaSensore, ciclaOperatore, commutaAltrimenti, CICLO_RIPETI,
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
