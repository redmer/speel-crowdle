# Speel CROWdle

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
1. Als je het woord hebt geraden – of je hebt verloren – krijg je de definitie van het begrip te zien, plus een link naar de term in op CROW-begrippen.

Veel speel- en leerplezier.

## Architectuur

De data van de CROW-thesaurus wordt met een SPARQL-query en een JSON-LD Frame eenvoudig ingeladen in de JavaScript-code.

TriplyDB-query: https://datasets.crow.nl/redmer-kronemeijer/-/queries/thesaurus-wordle/
