import { FC } from "react";
import LetterBox from "./LetterBox";

interface ResultActionsProps {
  termId: string;
  definition?: string;
  word: string;
}

const ResultActions: FC<ResultActionsProps> = ({
  termId,
  definition,
  word,
}) => {
  return (
    <div className="result">
      <h2>
        <div className="guess-row">
          {Array.from({ length: word.length }).map((_, i) => {
            const letter = word[i];
            const animationDelay = `${i * 0.2}s`;
            return (
              <LetterBox
                letter={letter}
                state="correct"
                animationDelay={animationDelay}
              />
            );
          })}
        </div>
      </h2>
      {definition ? (
        <p className="definition">{definition}</p>
      ) : (
        <p className="definition definition-missing">
          Een definitie voor ‘{word}’ ontbreekt helaas nog in de CROW-thesaurus.
        </p>
      )}

      <div className="result-actions">
        <a
          href={termId}
          target="_blank"
          rel="noopener"
          className="thesaurus-link"
        >
          Toon in CROW-Begrippen →
        </a>
      </div>
    </div>
  );
};

export default ResultActions;
