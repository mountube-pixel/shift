/* Cuce la pagina in un file unico, con stile e codice dentro l'HTML.
   - dist/percorso.html si apre con un doppio clic, senza server, e si può
     mandare a chi vuole provarlo;
   - dist/artefatto.html è lo stesso contenuto senza doctype, head e body,
     come lo vuole la pubblicazione degli artefatti su claude.ai.
   I sorgenti restano quelli di sempre: qui vengono solo cuciti insieme. */

import { build } from "esbuild";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const qui = percorso => fileURLToPath(new URL("../" + percorso, import.meta.url));

const html = await readFile(qui("index.html"), "utf8");
const css = await readFile(qui("ui/stile.css"), "utf8");

const LINK = '<link rel="stylesheet" href="ui/stile.css">';
const MODULO = '<script type="module" src="ui/app.js"></script>';
for (const pezzo of [LINK, MODULO, "<title>", "<body>", "</body>"])
  if (!html.includes(pezzo)) throw new Error("in index.html manca " + pezzo + ": aggiorna strumenti/file-unico.mjs");

const { outputFiles } = await build({
  entryPoints: [qui("ui/app.js")],
  bundle: true, format: "iife", target: "es2020",
  charset: "utf8", legalComments: "none", write: false,
});
/* dentro <script> la sequenza "</script" chiuderebbe il tag prima del tempo */
const js = outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

const stile = "<style>\n" + css + "</style>";
const codice = "<script>\n" + js + "</script>";
const completo = html.replace(LINK, () => stile).replace(MODULO, () => codice);

const titolo = html.match(/<title>[\s\S]*?<\/title>/)[0];
const corpo = html.slice(html.indexOf("<body>") + "<body>".length, html.indexOf("</body>"));
const frammento = titolo + "\n" + stile + "\n" + corpo.replace(MODULO, () => codice).trim() + "\n";

await mkdir(qui("dist"), { recursive: true });
await writeFile(qui("dist/percorso.html"), completo);
await writeFile(qui("dist/artefatto.html"), frammento);
const kb = s => Math.round(Buffer.byteLength(s) / 1024) + " KB";
console.log("dist/percorso.html " + kb(completo) + " · dist/artefatto.html " + kb(frammento));
