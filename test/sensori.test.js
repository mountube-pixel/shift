import { test } from "node:test";
import assert from "node:assert/strict";
import { esegui } from "../motore/indice.js";
import { A, DX, LUCE, BUIO, SE, livello, finale } from "./aiuto.js";

/* Sonda un sensore attraverso l'API pubblica: se è vero, la spia si accende. */
const vero = (liv, prima, sensore) =>
  finale(esegui(liv, [...prima, SE(sensore, [LUCE()])])).spia;

test("davanti libero / bloccato", () => {
  assert.equal(vero(livello(), [], "libero"), true);
  assert.equal(vero(livello(), [], "bloccato"), false);
  assert.equal(vero(livello({ muri: ["2,1"] }), [], "bloccato"), true);
});

test("i sensori laterali e quello posteriore guardano rispetto al muso", () => {
  const L = livello({ muri: ["1,2"] }); /* muro a sud del robot rivolto a est */
  assert.equal(vero(L, [], "dxMuro"), true);
  assert.equal(vero(L, [], "dxLibera"), false);
  assert.equal(vero(L, [], "sxLibera"), true);
  assert.equal(vero(L, [], "dietroLibero"), true);
});

test("fuori dal campo conta come muro anche per i sensori laterali", () => {
  assert.equal(vero(livello({ start: [1, 0] }), [], "sxMuro"), true);
});

test("la bussola indica la meta rispetto al muso del robot", () => {
  const da = band => livello({ G: 7, start: [3, 3], f: 0, band });
  assert.equal(vero(da([3, 1]), [], "metaDavanti"), true);
  assert.equal(vero(da([5, 3]), [], "metaDestra"), true);
  assert.equal(vero(da([1, 3]), [], "metaSinistra"), true);
  assert.equal(vero(da([3, 5]), [], "metaDietro"), true);
});

test("la bussola gira col robot: stessa meta, muso diverso, risposta diversa", () => {
  const L = livello({ G: 7, start: [3, 3], f: 2, band: [3, 1] }); /* meta a nord, muso a sud */
  assert.equal(vero(L, [], "metaDietro"), true);
  assert.equal(vero(L, [], "metaDavanti"), false);
});

test("sulla diagonale esatta vince l'asse davanti/dietro (regola del prototipo)", () => {
  const L = livello({ G: 7, start: [3, 3], f: 0, band: [5, 1] });
  assert.equal(vero(L, [], "metaDavanti"), true);
  assert.equal(vero(L, [], "metaDestra"), false);
  const L2 = livello({ G: 7, start: [3, 3], f: 1, band: [5, 1] });
  assert.equal(vero(L2, [], "metaDavanti"), true);
});

test("sono già passato di qui: falso alla prima visita, vero quando ci ritorno", () => {
  assert.equal(vero(livello(), [], "giaPassato"), false);
  assert.equal(vero(livello(), [A(), DX(), DX(), A()], "giaPassato"), true);
});

test("davanti non ci sono ancora stato: vero solo se libero e mai visitato", () => {
  assert.equal(vero(livello(), [], "nuovoDavanti"), true);
  assert.equal(vero(livello(), [A(), DX(), DX()], "nuovoDavanti"), false); /* davanti c'è il via */
  assert.equal(vero(livello({ muri: ["2,1"] }), [], "nuovoDavanti"), false); /* davanti c'è un muro */
});

test("la spia è memoria del robot: si accende, si legge, si spegne", () => {
  assert.equal(vero(livello(), [], "spia"), false);
  assert.equal(vero(livello(), [LUCE()], "spia"), true);
  assert.equal(vero(livello(), [LUCE(), BUIO()], "spia"), false);
});
