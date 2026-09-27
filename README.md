# Percorso

Gioco per tablet Android che insegna la logica procedurale a ragazzi di 11-14
anni. Il giocatore non guida il robot: scrive il programma che lo guiderà, con
blocchi componibili, e mentre lo monta vede sul campo la linea tratteggiata di
dove il robot finirà.

`prototipo.html` è la specifica vivente: apre in qualunque browser e mostra il
gioco di riferimento. Il codice del progetto ne riproduce la semantica.

## Struttura

| Cartella | Contenuto |
|---|---|
| `/motore` | il modello puro del gioco: blocchi, sensori, interprete. Zero DOM, zero canvas |
| `/ui` | la pagina: editor a cursore, palette, programma in miniatura del replay |
| `/render` | il campo isometrico su canvas, la linea tratteggiata, le particelle |
| `/test` | le prove del motore e dei moduli puri della UI; più avanti, di ogni livello |
| `/livelli` `/rete` `/app` | in arrivo, nell'ordine di lavoro del brief |

`PRIVACY.md` viene prima del codice e vincola il modello dati.

## Comandi

```bash
npm test                    # esegue tutte le prove (Node 20 o più recente, nessuna dipendenza)
python3 -m http.server 8000 # poi apri http://localhost:8000 (su Windows: py -m http.server 8000)
```

La pagina usa moduli JavaScript nativi, che il browser carica solo da un
server: per questo serve il mini-server invece del doppio clic sul file.

## Regola d'oro

Il motore è deterministico: stesso programma + stesso livello = stessa identica
cronaca, su ogni dispositivo. Le sfide fra amici si scambiano il programma, non
il risultato, e ogni cambiamento alla semantica del motore alza la versione del
formato sfida.
