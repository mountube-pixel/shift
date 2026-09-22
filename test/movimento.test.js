import { test } from "node:test";
import assert from "node:assert/strict";
import { esegui, battitiDi } from "../motore/indice.js";
import { A, DX, SX, USA, ASPETTA, LUCE, livello, finale } from "./aiuto.js";

test("avanti fa un passo solo, nella direzione del muso", () => {
  const u = finale(esegui(livello(), [A()]));
  assert.deepEqual([u.x, u.y, u.f], [2, 1, 1]);
});

test("le quattro direzioni: 0 nord, 1 est, 2 sud, 3 ovest", () => {
  const arrivo = f => { const u = finale(esegui(livello({ start: [2, 2], f }), [A()])); return [u.x, u.y]; };
  assert.deepEqual(arrivo(0), [2, 1]);
  assert.deepEqual(arrivo(1), [3, 2]);
  assert.deepEqual(arrivo(2), [2, 3]);
  assert.deepEqual(arrivo(3), [1, 2]);
});

test("gira cambia solo la direzione, mai la casella", () => {
  const u = finale(esegui(livello({ f: 0 }), [DX(), DX(), DX(), DX(), SX()]));
  assert.deepEqual([u.x, u.y, u.f], [1, 1, 3]);
});

test("contro un muro il robot resta fermo, segna l'urto e il programma continua", () => {
  const r = esegui(livello({ muri: ["2,1"] }), [A(), SX(), A()]);
  assert.equal(r.passi[1].fx[0].t, "urto");
  assert.deepEqual([finale(r).x, finale(r).y], [1, 0]);
  assert.equal(r.esito, "finito");
});

test("anche il bordo del campo blocca come un muro", () => {
  const r = esegui(livello({ start: [0, 0], f: 3 }), [A()]);
  assert.equal(r.passi[1].fx[0].t, "urto");
  assert.deepEqual([finale(r).x, finale(r).y], [0, 0]);
});

test("appena tocca la bandiera l'esecuzione si ferma lì", () => {
  const r = esegui(livello({ band: [3, 1] }), [A(), A(), DX(), A()]);
  assert.equal(r.esito, "ok");
  assert.equal(battitiDi(r), 2);
});

test("ogni azione eseguita è un battito: urti, attese, spia e attrezzi a vuoto compresi", () => {
  const r = esegui(livello({ muri: ["2,1"] }), [LUCE(), ASPETTA(), USA(), A(), DX()]);
  assert.equal(battitiDi(r), 5);
  assert.equal(r.esito, "finito");
});

test("programma vuoto: zero battiti, esito finito", () => {
  const r = esegui(livello(), []);
  assert.equal(battitiDi(r), 0);
  assert.equal(r.esito, "finito");
});

test("il primo fotogramma porta lo stato iniziale della mappa, non quello finale", () => {
  const L = livello({ est: ["2,1"], fuoco: ["3,1"], band: [4, 1] });
  const r = esegui(L, [A(), USA(), A(), A()]);
  assert.deepEqual(r.passi[0].ogE, ["2,1"]);
  assert.deepEqual(r.passi[0].fuoco, ["3,1"]);
  assert.deepEqual(finale(r).fuoco, []);
});
