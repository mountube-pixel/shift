import { test } from "node:test";
import assert from "node:assert/strict";
import { contaBlocchi, nuovoBlocco, validaProgramma } from "../motore/indice.js";
import { A, DX, SX, SE, RIPETI, COSTEGGIA_DESTRA } from "./aiuto.js";

test("il costeggiamento del brief conta esattamente 7 blocchi", () => {
  assert.equal(contaBlocchi(COSTEGGIA_DESTRA()), 7);
});

test("contaBlocchi conta anche i rami altrimenti, ma non sensori e operatori", () => {
  assert.equal(contaBlocchi([SE("libero", [A()], [DX(), SX()])]), 4);
  assert.equal(contaBlocchi([RIPETI(10, [A()])]), 2); /* il 10 è un parametro */
});

test("nuovoBlocco crea i blocchi coi valori di partenza del prototipo", () => {
  assert.deepEqual(nuovoBlocco("ripeti"), { t: "ripeti", n: 3, body: [] });
  assert.deepEqual(nuovoBlocco("se"),
    { t: "se", c: "libero", op: "base", c2: "libero", body: [], alt: null });
  assert.throws(() => nuovoBlocco("volare"));
});

test("validaProgramma accetta un programma buono", () => {
  assert.deepEqual(validaProgramma(COSTEGGIA_DESTRA()), []);
});

test("validaProgramma elenca i problemi di un programma rotto", () => {
  const errori = validaProgramma([
    { t: "volare" },
    { t: "ripeti", n: 0, body: [A()] },
    { t: "se", c: "libero", op: "xor", c2: "libero", body: [], alt: null },
    { t: "se", c: "telepatia", op: "e", c2: "boh", body: [], alt: "no" },
    { t: "finche", c: "libero" },
  ]);
  assert.equal(errori.length, 7);
  assert.match(errori[0], /volare/);
});

test("validaProgramma scende anche dentro i corpi annidati", () => {
  const errori = validaProgramma([RIPETI(2, [{ t: "boh" }])]);
  assert.equal(errori.length, 1);
  assert.match(errori[0], /\[0\]\.body\[0\]/);
});
