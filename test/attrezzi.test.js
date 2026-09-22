import { test } from "node:test";
import assert from "node:assert/strict";
import { esegui, battitiDi } from "../motore/indice.js";
import { A, USA, LUCE, SE, livello, finale } from "./aiuto.js";

const vero = (liv, prima, sensore) =>
  finale(esegui(liv, [...prima, SE(sensore, [LUCE()])])).spia;

test("passare sopra l'estintore lo raccoglie, usa davanti al fuoco lo spegne", () => {
  const L = livello({ est: ["2,1"], fuoco: ["3,1"], band: [4, 1] });
  const r = esegui(L, [A(), USA(), A(), A()]);
  assert.equal(r.passi[1].fx[0].t, "presa");
  assert.equal(r.passi[1].est, 1);
  assert.equal(r.passi[2].fx[0].t, "usa");
  assert.deepEqual(r.passi[2].fuoco, []);
  assert.equal(r.passi[2].est, 0); /* l'estintore si consuma */
  assert.equal(r.esito, "ok");
  assert.equal(battitiDi(r), 4);
});

test("usa senza l'attrezzo giusto non fa niente e il fuoco resta", () => {
  const L = livello({ fuoco: ["2,1"] });
  const r = esegui(L, [USA(), A()]);
  assert.equal(r.passi[1].fx[0].t, "vuoto");
  assert.deepEqual(r.passi[1].fuoco, ["2,1"]);
  assert.equal(r.passi[2].fx[0].t, "urto"); /* il fuoco blocca ancora */
});

test("la chiave apre la porta, una volta sola", () => {
  const L = livello({ chiave: ["2,1"], porta: ["3,1"], band: [4, 1] });
  const r = esegui(L, [A(), USA(), A(), A()]);
  assert.equal(r.passi[2].fx[0].e, "APERTA!");
  assert.deepEqual(r.passi[2].porta, []);
  assert.equal(r.passi[2].chiavi, 0);
  assert.equal(r.esito, "ok");
});

test("un estintore spegne un fuoco solo: sul secondo l'usa va a vuoto", () => {
  const L = livello({ est: ["2,1"], fuoco: ["3,1", "4,1"] });
  const r = esegui(L, [A(), USA(), A(), USA()]);
  assert.equal(r.passi[2].fx[0].t, "usa");
  assert.equal(r.passi[4].fx[0].t, "vuoto");
  assert.deepEqual(r.passi[4].fuoco, ["4,1"]);
});

test("fuoco e porta bloccano il passo e i sensori li vedono", () => {
  const F = livello({ fuoco: ["2,1"] });
  assert.equal(vero(F, [], "bloccato"), true);
  assert.equal(vero(F, [], "fuocoDavanti"), true);
  assert.equal(vero(F, [], "portaDavanti"), false);
  const P = livello({ porta: ["2,1"] });
  assert.equal(vero(P, [], "portaDavanti"), true);
});

test("l'acqua blocca senza stivali; con gli stivali si passa e l'acqua resta", () => {
  const senza = esegui(livello({ acqua: ["2,1"] }), [A()]);
  assert.equal(senza.passi[1].fx[0].t, "urto");
  const L = livello({ stivali: ["2,1"], acqua: ["3,1"], band: [4, 1] });
  const r = esegui(L, [A(), A(), A()]);
  assert.equal(r.passi[1].fx[0].t, "presa");
  assert.equal(r.esito, "ok");
});

test("i sensori degli attrezzi: acqua davanti e cosa ho nello zaino", () => {
  const L = livello({ acqua: ["2,1"] });
  assert.equal(vero(L, [], "acquaDavanti"), true);
  assert.equal(vero(L, [], "hoStivali"), false);
  const Z = livello({ est: ["2,1"], chiave: ["3,1"], stivali: ["1,2"] });
  assert.equal(vero(Z, [A()], "hoEstintore"), true);
  assert.equal(vero(Z, [A()], "hoChiave"), false);
  assert.equal(vero(Z, [A(), A()], "hoChiave"), true);
});

test("gli stivali sono per sempre: due acque, un paio di stivali", () => {
  const L = livello({ G: 7, stivali: ["2,1"], acqua: ["3,1", "5,1"], band: [6, 1] });
  const r = esegui(L, [A(), A(), A(), A(), A()]);
  assert.equal(r.esito, "ok");
  assert.equal(finale(r).stivali, true);
});
