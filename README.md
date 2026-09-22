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
| `/test` | le prove del motore e, più avanti, di ogni livello |
| `/livelli` | tutorial, arene e famiglie del laboratorio (in arrivo) |
| `/ui` `/render` `/rete` `/app` | in arrivo, nell'ordine di lavoro del brief |

`PRIVACY.md` viene prima del codice e vincola il modello dati.

## Comandi

```bash
npm test    # esegue tutte le prove (serve Node 20 o più recente, nessuna dipendenza)
```

## Regola d'oro

Il motore è deterministico: stesso programma + stesso livello = stessa identica
cronaca, su ogni dispositivo. Le sfide fra amici si scambiano il programma, non
il risultato, e ogni cambiamento alla semantica del motore alza la versione del
formato sfida.
