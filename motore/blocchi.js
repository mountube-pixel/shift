/* Catalogo dei blocchi e dei sensori del linguaggio.
   Le forme degli oggetti ({t:"avanti"}, {t:"ripeti",n,body}, …) sono le stesse
   del prototipo: un programma salvato lì gira identico qui. Cambiare nomi,
   campi o semantica significa alzare la versione del formato sfida. */

export const AZIONI = ["avanti", "dx", "sx", "usa", "accendi", "spegnispia", "aspetta"];
export const CONTROLLI = ["ripeti", "finche", "se", "sempre"];

/* Etichette dei sensori. L'ordine è quello in cui la UI li farà ciclare:
   i sensori nuovi si aggiungono in coda, mai in mezzo. */
export const SENSORI = {
  libero: "davanti è libero",
  bloccato: "davanti è bloccato",
  dxLibera: "a destra è libero",
  dxMuro: "a destra c'è un muro",
  sxLibera: "a sinistra è libero",
  sxMuro: "a sinistra c'è un muro",
  dietroLibero: "dietro è libero",
  metaDavanti: "la meta è davanti",
  metaDestra: "la meta è a destra",
  metaSinistra: "la meta è a sinistra",
  metaDietro: "la meta è dietro",
  giaPassato: "sono già passato di qui",
  nuovoDavanti: "davanti non ci sono ancora stato",
  spia: "la spia è accesa",
  fuocoDavanti: "davanti c'è un fuoco",
  portaDavanti: "davanti c'è una porta",
  acquaDavanti: "davanti c'è acqua",
  hoEstintore: "ho un estintore",
  hoChiave: "ho una chiave",
  hoStivali: "ho gli stivali",
};

/* L'operatore dentro il "se": nessuno, e, o. Niente "non": a quest'età
   le coppie opposte già pronte (libero/bloccato) funzionano meglio. */
export const OPERATORI = { base: "—", e: "e", o: "o" };

export function nuovoBlocco(t) {
  const modelli = {
    avanti: () => ({ t: "avanti" }),
    dx: () => ({ t: "dx" }),
    sx: () => ({ t: "sx" }),
    usa: () => ({ t: "usa" }),
    aspetta: () => ({ t: "aspetta" }),
    accendi: () => ({ t: "accendi" }),
    spegnispia: () => ({ t: "spegnispia" }),
    ripeti: () => ({ t: "ripeti", n: 3, body: [] }),
    finche: () => ({ t: "finche", c: "libero", body: [] }),
    se: () => ({ t: "se", c: "libero", op: "base", c2: "libero", body: [], alt: null }),
    sempre: () => ({ t: "sempre", body: [] }),
  };
  const f = modelli[t];
  if (!f) throw new Error("blocco sconosciuto: " + t);
  return f();
}

/* Un blocco = un nodo, rami "altrimenti" compresi. Sensori e operatori sono
   parametri, non blocchi: il costeggiamento del laboratorio deve contare 7. */
export function contaBlocchi(lista) {
  let n = 0;
  for (const b of lista) {
    n++;
    if (b.body) n += contaBlocchi(b.body);
    if (b.alt) n += contaBlocchi(b.alt);
  }
  return n;
}

/* Controlla la struttura di un programma (per sfide ricevute e salvataggi):
   ritorna la lista dei problemi, vuota se va tutto bene. */
export function validaProgramma(lista, dove = "programma") {
  if (!Array.isArray(lista)) return [dove + ": non è una lista"];
  const errori = [];
  lista.forEach((b, i) => {
    const qui = dove + "[" + i + "]";
    if (!b || typeof b !== "object") { errori.push(qui + ": non è un blocco"); return; }
    if (AZIONI.includes(b.t)) return;
    if (!CONTROLLI.includes(b.t)) { errori.push(qui + ": tipo sconosciuto \"" + b.t + "\""); return; }
    if (!Array.isArray(b.body)) errori.push(qui + ": manca il corpo");
    else errori.push(...validaProgramma(b.body, qui + ".body"));
    if (b.t === "ripeti" && !(Number.isInteger(b.n) && b.n >= 1 && b.n <= 999))
      errori.push(qui + ": numero di ripetizioni non valido (" + b.n + ")");
    if (b.t === "finche" && !(b.c in SENSORI))
      errori.push(qui + ": sensore sconosciuto \"" + b.c + "\"");
    if (b.t === "se") {
      if (!(b.c in SENSORI)) errori.push(qui + ": sensore sconosciuto \"" + b.c + "\"");
      const op = b.op || "base";
      if (!(op in OPERATORI)) errori.push(qui + ": operatore sconosciuto \"" + b.op + "\"");
      else if (op !== "base" && !(b.c2 in SENSORI))
        errori.push(qui + ": secondo sensore sconosciuto \"" + b.c2 + "\"");
      if (b.alt != null) {
        if (!Array.isArray(b.alt)) errori.push(qui + ": il ramo altrimenti non è una lista");
        else errori.push(...validaProgramma(b.alt, qui + ".alt"));
      }
    }
  });
  return errori;
}
