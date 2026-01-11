# Speel CROWdle

> _Raad dagelijks het CROW-begrip van de dag – binnen zes pogingen._

- [**Speel nu CROWdle**](https://rdmr.eu/speel-crowdle/)
- [Doorblader de CROW-Thesaurus](https://begrippen.crow.nl/)

## Spelregels

1. Elke dag (vanaf middernacht) is er één woord het woord van de dag, live geladen uit de CROW-thesaurus.
1. Raad het woord binnen 6 beurten.
1. Je raadt door een woord in te voeren.
   Een **GROENE** letter staat op de juiste plek.
   Een **GELE** letter staat niet op de juiste plek, maar komt wel in het woord voor.
   Een **GRIJZE** letter komt niet in het woord voor.
1. Als je het woord na 6 pogingen nog niet hebt geraden, krijg je een hint en nog één kans.
1. Als je het woord hebt geraden – of je hebt verloren – krijg je de definitie van het begrip te zien, plus een link naar de term in op CROW-Begrippen.

Veel speel- en leerplezier.

## Architectuur

- De **woorden van de dag** komen uit de CROW-thesaurus, middels deze [TriplyDB-query].
  De query combineert SPARQL met een JSON-LD Frame voor een eenvoudige verwerking in de JavaScript-code.
- Een statische webpagina, gehost op GitHub Actions is TypeScript + React-code, gecompileerd door Vite.

[TriplyDB-query]: https://datasets.crow.nl/redmer-kronemeijer/-/queries/thesaurus-wordle/

## Debugging

- `?date=2026-01-10` forceert het laden van de puzzel van 10 januari 2026.
