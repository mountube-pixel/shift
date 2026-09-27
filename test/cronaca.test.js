/* Cosa racconta ogni fotogramma oltre alla posizione: l'azione eseguita e
   i giri dei cicli aperti. Il replay a schermo intero li mostra accanto al
   campo; un domani un robot vero potrà ripetere le azioni una per una. */

import { test } from "node:test";
import assert from "node:assert/strict";
import { esegui } from "../motore/indice.js";
import { A, DX, USA, ASPETTA, LUCE, RIPETI, FINCHE, SE, SEMPRE, livello } from "./aiuto.js";

const giri = r => r.passi.slice(1).map(p => p.giri.map(g => g.giro));

test("ogni fotogramma registra l'azione eseguita, anche quando non cambia niente", () => {
  const r = esegui(livello({ muri: ["2,1"] }), [A(), DX(), LUCE(), LUCE(), ASPETTA(), USA()]);
  assert.deepEqual(r.passi.map(p => p.az), [null, "avanti", "dx", "accendi", "accendi", "aspetta", "usa"]);
});

test("dentro un ripeti ogni azione sa a che giro è, e su quanti", () => {
  const r = esegui(livello(), [RIPETI(3, [A()])]);
  assert.deepEqual(r.passi.slice(1).map(p => p.giri.map(g => [g.giro, g.di])), [[[1, 3]], [[2, 3]], [[3, 3]]]);
});

test("ripeti annidati: la pila va dal ciclo esterno a quello interno", () => {
  const r = esegui(livello(), [RIPETI(2, [RIPETI(2, [DX()])])]);
  assert.deepEqual(giri(r), [[1, 1], [1, 2], [2, 1], [2, 2]]);
});

test("finché e per sempre contano i giri anche senza un numero dichiarato", () => {
  const f = esegui(livello({ muri: ["4,1"] }), [FINCHE("libero", [A()])]);
  assert.deepEqual(giri(f), [[1], [2]]);
  assert.equal(f.passi[1].giri[0].di, undefined);
  const s = esegui(livello({ band: [4, 1] }), [SEMPRE([A()])]);
  assert.deepEqual(giri(s), [[1], [2], [3]]);
});

test("fuori dai cicli la pila è vuota, e il se non conta come ciclo", () => {
  const r = esegui(livello(), [A(), SE("libero", [A()])]);
  assert.deepEqual(giri(r), [[], []]);
});

test("i giri di un fotogramma non cambiano quando l'esecuzione va avanti", () => {
  const r = esegui(livello(), [RIPETI(3, [DX()])]);
  assert.deepEqual(giri(r), [[1], [2], [3]]); /* copie, non la pila viva */
});
