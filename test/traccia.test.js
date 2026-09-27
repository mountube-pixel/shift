import { test } from "node:test";
import assert from "node:assert/strict";
import { htmlTraccia, antenati, testoGiro, etichetta } from "../ui/traccia.js";
import { conId } from "../ui/cursore.js";
import { A, DX, SX, SE, RIPETI, FINCHE, SEMPRE, COSTEGGIA_DESTRA } from "./aiuto.js";

const conteggio = (h, pezzo) => h.split(pezzo).length - 1;

test("la miniatura ha una riga per ogni blocco, rami altrimenti compresi", () => {
  const prog = COSTEGGIA_DESTRA().map(conId); /* 7 blocchi */
  const h = htmlTraccia(prog);
  assert.equal(conteggio(h, "data-tid="), 7);
  assert.equal(conteggio(h, "tr-alt"), 2);
});

test("solo i cicli hanno il contatore dei giri, il se no", () => {
  const prog = [RIPETI(2, [A()]), FINCHE("libero", [A()]), SEMPRE([DX()]), SE("libero", [SX()])].map(conId);
  assert.equal(conteggio(htmlTraccia(prog), "data-giro="), 3);
});

test("un corpo vuoto si vede come vuoto", () => {
  assert.match(htmlTraccia([RIPETI(3, [])].map(conId)), /tr-vuoto/);
});

test("le etichette dicono il valore scelto, operatore compreso", () => {
  assert.equal(etichetta(RIPETI(4, [])), "ripeti <b>4 volte</b>");
  assert.equal(etichetta(SE("libero", [], null, "e", "spia")),
    "se <b>davanti è libero</b> e <b>la spia è accesa</b>");
  assert.equal(etichetta(A()), "avanti");
});

test("antenati elenca i blocchi che contengono ciascun blocco, dal più esterno", () => {
  const prog = COSTEGGIA_DESTRA().map(conId);
  const mappa = antenati(prog);
  const sempre = prog[0], se = sempre.body[0], seInterno = se.alt[0];
  assert.deepEqual(mappa.get(sempre.id), []);
  assert.deepEqual(mappa.get(se.body[0].id), [sempre.id, se.id]);
  assert.deepEqual(mappa.get(seInterno.alt[0].id), [sempre.id, se.id, seInterno.id]);
});

test("testoGiro: su quanti giri solo quando si sa", () => {
  assert.equal(testoGiro({ giro: 2, di: 4 }), "giro 2/4");
  assert.equal(testoGiro({ giro: 7 }), "giro 7");
});
