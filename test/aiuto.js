/* Scorciatoie per scrivere i test: costruttori di blocchi e di livelli minimi. */

export const A = () => ({ t: "avanti" });
export const DX = () => ({ t: "dx" });
export const SX = () => ({ t: "sx" });
export const USA = () => ({ t: "usa" });
export const ASPETTA = () => ({ t: "aspetta" });
export const LUCE = () => ({ t: "accendi" });
export const BUIO = () => ({ t: "spegnispia" });
export const RIPETI = (n, body) => ({ t: "ripeti", n, body });
export const FINCHE = (c, body) => ({ t: "finche", c, body });
export const SE = (c, body, alt = null, op = "base", c2 = "libero") => ({ t: "se", c, op, c2, body, alt });
export const SEMPRE = body => ({ t: "sempre", body });

/* Un livello 5×5 vuoto: robot in [1,1] rivolto a est, bandiera lontana. */
export const livello = (extra = {}) => ({ G: 5, start: [1, 1], f: 1, band: [4, 4], ...extra });

/* L'ultimo fotogramma di una cronaca: dove e come è finito il robot. */
export const finale = r => r.passi[r.passi.length - 1];

/* Il costeggiamento del brief: mano destra sul muro, 7 blocchi.
   «se a destra è libero: gira a destra e avanza; altrimenti se davanti è
   libero avanza; altrimenti gira a sinistra», ripetuto per sempre. */
export const COSTEGGIA_DESTRA = () => [
  SEMPRE([
    SE("dxLibera", [DX(), A()],
      [SE("libero", [A()], [SX()])]),
  ]),
];

/* La variante che viene naturale e che il laboratorio deve bocciare:
   «se è bloccato gira a destra, altrimenti avanti». */
export const GIRA_SE_BLOCCATO = () => [
  SEMPRE([
    SE("bloccato", [DX()], [A()]),
  ]),
];
