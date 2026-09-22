import { test } from "node:test";
import assert from "node:assert/strict";
import { esegui, battitiDi, ottimo } from "../motore/indice.js";
import { livello } from "./aiuto.js";
import { FAMIGLIA_1 } from "./labirinti.js";

test("in linea retta il percorso ottimo è tutto avanti", () => {
  assert.deepEqual(ottimo(livello({ band: [3, 1] })), ["avanti", "avanti"]);
});

test("quando serve girare, il giro costa un'azione come dice il par", () => {
  assert.deepEqual(ottimo(livello({ band: [1, 3] })), ["dx", "avanti", "avanti"]);
});

test("bandiera irraggiungibile: nessun percorso", () => {
  const L = livello({ band: [3, 3], muri: ["3,2", "2,3", "4,3", "3,4"] });
  assert.equal(ottimo(L), null);
});

test("le azioni dell'ottimo, eseguite come blocchi, arrivano in esattamente quei battiti", () => {
  const L = FAMIGLIA_1[0];
  const azioni = ottimo(L);
  const r = esegui(L, azioni.map(a => ({ t: a })));
  assert.equal(r.esito, "ok");
  assert.equal(battitiDi(r), azioni.length);
});
