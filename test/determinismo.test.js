/* Il determinismo è l'architrave delle sfide: due dispositivi che eseguono lo
   stesso programma sullo stesso livello devono produrre la stessa identica
   cronaca, e un programma che passa dal JSON di una sfida deve restare lo
   stesso programma. */

import { test } from "node:test";
import assert from "node:assert/strict";
import { esegui } from "../motore/indice.js";
import { COSTEGGIA_DESTRA } from "./aiuto.js";
import { FAMIGLIA_2 } from "./labirinti.js";

test("due esecuzioni uguali danno cronache identiche, fotogramma per fotogramma", () => {
  const a = esegui(FAMIGLIA_2[0], COSTEGGIA_DESTRA());
  const b = esegui(FAMIGLIA_2[0], COSTEGGIA_DESTRA());
  assert.deepEqual(a, b);
});

test("un programma sopravvive intatto al viaggio in JSON (come in una sfida)", () => {
  const prog = COSTEGGIA_DESTRA();
  const tornato = JSON.parse(JSON.stringify(prog));
  const a = esegui(FAMIGLIA_2[1], prog);
  const b = esegui(FAMIGLIA_2[1], tornato);
  assert.deepEqual(a, b);
});

test("eseguire non sporca né il livello né il programma", () => {
  const L = JSON.parse(JSON.stringify(FAMIGLIA_2[2]));
  const prog = COSTEGGIA_DESTRA();
  const fotoL = JSON.stringify(L), fotoP = JSON.stringify(prog);
  esegui(L, prog);
  assert.equal(JSON.stringify(L), fotoL);
  assert.equal(JSON.stringify(prog), fotoP);
});
