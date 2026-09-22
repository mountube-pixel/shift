# PRIVACY — Percorso

Questo documento viene prima del codice e lo vincola. Ogni scelta tecnica che
tocca dati di ragazzi fra gli 11 e i 14 anni deve rispettarlo: se una funzione
lo contraddice, si cambia la funzione oppure si aggiorna — consapevolmente e
per primo — questo documento.

## Cosa non raccogliamo, mai

- Nessun dato personale: niente nome reale, email, età, telefono, posizione,
  foto, rubrica, account social.
- Nessuna analytics che profila, nessun identificatore pubblicitario,
  nessun crash reporting che raccolga identificatori del dispositivo.
- Nessuna pubblicità, nessun acquisto in app.
- Nessuna chat libera: solo invito e accettazione di sfide, più eventuali
  emoji scelte da un elenco predefinito.

## Identità nel gioco

- L'identificativo del giocatore è **anonimo, casuale e locale al
  dispositivo**: generato alla prima apertura, non deriva da hardware o
  account (no Android ID, no IMEI, no MAC), rigenerabile senza perdere nulla
  di dovuto ad altri.
- Il **nickname** si pesca da un dizionario chiuso di parole innocue
  (es. «Gatto22»): mai testo libero, mai il nome vero.
- Non esistono profili pubblici né ricerca di utenti: ci si incontra solo
  con un **codice stanza** o scambiandosi una sfida di persona.

## Dove vivono i dati

| Dato | Dove | Quando esce dal dispositivo |
|---|---|---|
| Progressi, premi dell'Officina, programmi salvati | Solo sul tablet (storage locale dell'app) | Mai |
| Una sfida condivisa | Codice testuale / QR | Solo se il ragazzo la condivide; contiene unicamente `{v, arena, programma, battiti, blocchi, autore}` dove `autore` è il nickname |
| Stanza di classe | Server (quando esisterà) | Codice stanza, nickname, programmi inviati e punteggi per arena. Nient'altro |

La parte didattica (Tutorial, Arena contro il bot, Laboratorio, Officina)
funziona **per intero offline**: nessuna funzione richiede un account o la rete.

## Cancellazione

- L'insegnante può **eliminare la stanza e tutto il suo contenuto** in
  qualunque momento, con un solo gesto.
- Le stanze non usate scadono e vengono eliminate da sole.
- Disinstallare l'app elimina tutti i dati locali; non resta nulla altrove,
  salvo le sfide che il ragazzo ha esplicitamente condiviso.

## Conseguenze sul modello dati (regole per chi scrive il codice)

1. Nessuna struttura dati con campi per informazioni personali. Se un campo
   non è elencato in questo documento, non si aggiunge senza prima aggiornare
   il documento.
2. Ogni oggetto che viaggia in rete è **versionato** (`"v"`) e
   **rieseguibile**: il server verifica i punteggi rieseguendo il programma
   con lo stesso motore, mai fidandosi del risultato dichiarato dal client.
3. Il dizionario dei nickname vive in `/rete` ed è l'unica fonte di nomi.
4. Nessuna libreria terza di analytics o tracking. Se un giorno servirà
   telemetria, sarà fatta di contatori aggregati e anonimi — e passerà prima
   da qui.
5. I progressi si salvano con lo storage dell'app (Preferences), non con
   `localStorage`, così sopravvivono e restano confinati al dispositivo.

## Per la pubblicazione (più avanti)

L'app rientra nelle norme «Famiglie» di Google Play: servirà un'informativa
privacy raggiungibile da un URL pubblico, coerente con questo documento, e le
risposte ai questionari di Google su età e contenuti spettano al titolare
dell'app.
