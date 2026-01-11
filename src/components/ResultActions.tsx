import { FC } from "react";
import ShareButton from "./ShareButton";

interface ResultActionsProps {
  termId: string;
  definition: string;
  guesses: string[];
  word: string;
  date: string;
  playerWon: boolean;
}

const ResultActions: FC<ResultActionsProps> = ({
  termId,
  definition,
  guesses,
  word,
  date,
  playerWon,
}) => {
  return (
    <div className="result">
      <h2>
        Woord: <span className="word-label">{word.toUpperCase()}</span>
      </h2>
      <p className="definition">{definition}</p>
      <div className="result-actions">
        <a
          href={termId}
          target="_blank"
          rel="noopener noreferrer"
          className="thesaurus-link"
        >
          Toon in CROW-Begrippen →
        </a>
        <ShareButton
          guesses={guesses}
          word={word}
          date={date}
          playerWon={playerWon}
          type="copy"
        />
        <ShareButton
          guesses={guesses}
          word={word}
          date={date}
          playerWon={playerWon}
          type="share"
        />
      </div>
    </div>
  );
};

export default ResultActions;
