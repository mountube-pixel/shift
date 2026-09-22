import { test } from "node:test";
import assert from "node:assert/strict";
import { esegui, battitiDi, LIMITI } from "../motore/indice.js";
import { A, DX, LUCE, RIPETI, FINCHE, SE, SEMPRE, livello, finale } from "./aiuto.js";

test("ripeti esegue il corpo N volte", () => {
  const r = esegui(livello(), [RIPETI(3, [A()])]);
  assert.deepEqual([finale(r).x, finale(r).y], [4, 1]);
  assert.equal(battitiDi(r), 3);
});

test("ripeti dentro ripeti: il giro quadrato torna al via", () => {
  const r = esegui(livello(), [RIPETI(4, [RIPETI(2, [A()]), DX()])]);
  const u = finale(r);
  assert.deepEqual([u.x, u.y, u.f], [1, 1, 1]);
  assert.equal(battitiDi(r), 12);
});

test("ripeti finché ripete MENTRE il sensore è vero", () => {
  const r = esegui(livello({ muri: ["4,1"] }), [FINCHE("libero", [A()])]);
  assert.deepEqual([finale(r).x, finale(r).y], [3, 1]);
  assert.equal(r.esito, "finito");
});

test("ripeti finché con la guardia subito falsa non esegue mai il corpo", () => {
  const r = esegui(livello({ muri: ["2,1"] }), [FINCHE("libero", [A()])]);
  assert.equal(battitiDi(r), 0);
  assert.equal(r.esito, "finito");
});

test("se sceglie il ramo giusto, altrimenti compreso", () => {
  const conVia = finale(esegui(livello(), [SE("libero", [LUCE()], [DX()])]));
  assert.equal(conVia.spia, true);
  assert.equal(conVia.f, 1);
  const murato = finale(esegui(livello({ muri: ["2,1"] }), [SE("libero", [LUCE()], [DX()])]));
  assert.equal(murato.spia, false);
  assert.equal(murato.f, 2);
});

test("l'operatore e vuole entrambi i sensori veri, l'operatore o ne basta uno", () => {
  const conE = finale(esegui(livello(), [SE("libero", [LUCE()], null, "e", "spia")]));
  assert.equal(conE.spia, false);
  const conO = finale(esegui(livello(), [SE("libero", [LUCE()], null, "o", "spia")]));
  assert.equal(conO.spia, true);
});

test("ripeti per sempre si ferma da solo alla bandiera", () => {
  const r = esegui(livello({ band: [4, 1] }), [SEMPRE([A()])]);
  assert.equal(r.esito, "ok");
  assert.equal(battitiDi(r), 3);
});

test("ripeti per sempre che gira a vuoto si ferma al tetto dei passi: esito lungo", () => {
  const r = esegui(livello(), [SEMPRE([DX()])]);
  assert.equal(r.esito, "lungo");
  assert.equal(battitiDi(r), LIMITI.passi);
});

test("ripeti per sempre col corpo vuoto viene saltato", () => {
  const r = esegui(livello(), [SEMPRE([]), LUCE()]);
  assert.equal(r.esito, "finito");
  assert.equal(finale(r).spia, true);
});

test("il tetto del finché spezza un ciclo che non muove mai (parte del formato v1)", () => {
  const r = esegui(livello(), [LUCE(), FINCHE("spia", [DX()])]);
  assert.equal(r.esito, "finito");
  /* la guardia passa 401 volte prima del taglio: 1 accendi + 401 giri */
  assert.equal(battitiDi(r), 402);
});
