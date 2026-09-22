/* La verifica che dà senso al Laboratorio, presa di peso dal brief:
   su labirinti semplicemente connessi la sequenza fissa e il «se bloccato
   gira» devono fallire, il costeggiamento col sensore laterale deve passare
   dappertutto con 7 blocchi. Se uno di questi test si rompe, si è rotta la
   didattica, non solo il codice. */

import { test } from "node:test";
import assert from "node:assert/strict";
import { esegui, ottimo, contaBlocchi, validaLivello } from "../motore/indice.js";
import { COSTEGGIA_DESTRA, GIRA_SE_BLOCCATO } from "./aiuto.js";
import { FAMIGLIA_1, FAMIGLIA_2 } from "./labirinti.js";

const TUTTI = [...FAMIGLIA_1, ...FAMIGLIA_2];

test("i sei labirinti del laboratorio sono dati validi", () => {
  for (const L of TUTTI) assert.deepEqual(validaLivello(L), []);
});

test("il costeggiamento (7 blocchi) risolve tutti e sei i labirinti", () => {
  const prog = COSTEGGIA_DESTRA();
  assert.equal(contaBlocchi(prog), 7);
  for (const L of TUTTI) {
    const r = esegui(L, prog);
    assert.equal(r.esito, "ok", "labirinto " + JSON.stringify(L.band) + " G" + L.G);
  }
});

test("una sequenza fissa passa il suo labirinto ma non tutti e tre", () => {
  const azioni = ottimo(FAMIGLIA_1[0]);
  const prog = azioni.map(a => ({ t: a }));
  const esiti = FAMIGLIA_1.map(L => esegui(L, prog).esito);
  assert.equal(esiti[0], "ok");
  assert.equal(esiti.every(e => e === "ok"), false);
});

test("«se è bloccato gira a destra, altrimenti avanti» fallisce su tutti e sei", () => {
  for (const L of TUTTI) {
    const r = esegui(L, GIRA_SE_BLOCCATO());
    assert.notEqual(r.esito, "ok", "labirinto " + JSON.stringify(L.band) + " G" + L.G);
  }
});
