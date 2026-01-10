import { FC, useEffect, useState } from "react";
import "../styles/WordleGame.css";

interface WordData {
  id: string;
  label: string;
  definition: string;
  strlen: string;
}

interface WordleGameProps {
  wordData: WordData;
}

type LetterState = "correct" | "present" | "absent";
type LetterStates = Record<string, LetterState>;

const WordleGame: FC<WordleGameProps> = ({ wordData }) => {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [won, setWon] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [letterStates, setLetterStates] = useState<LetterStates>({});

  const word = wordData.label.toLowerCase();
  const maxGuesses = 6;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (won) return;

      if (e.key === "Enter") {
        handleSubmitGuess();
      } else if (e.key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[a-zñ]$/i.test(e.key)) {
        if (currentGuess.length < word.length) {
          setCurrentGuess((prev) => prev + e.key.toLowerCase());
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentGuess, won, word]);

  const getLetterState = (letter: string, guessWord: string): LetterState => {
    // Correct position
    if (word[guessWord.indexOf(letter)] === letter) {
      return "correct";
    }

    // Wrong position
    if (word.includes(letter)) {
      return "present";
    }

    // Not in word
    return "absent";
  };

  const handleSubmitGuess = (): void => {
    if (currentGuess.length !== word.length) {
      setMessage(`Woord moet ${word.length} letters lang zijn`);
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    const newGuess = currentGuess;
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);

    // Update letter states
    const newLetterStates: LetterStates = { ...letterStates };
    for (let i = 0; i < newGuess.length; i++) {
      const letter = newGuess[i];
      if (word[i] === letter) {
        newLetterStates[letter] = "correct";
      } else if (
        word.includes(letter) &&
        newLetterStates[letter] !== "correct"
      ) {
        newLetterStates[letter] = "present";
      } else if (!newLetterStates[letter]) {
        newLetterStates[letter] = "absent";
      }
    }
    setLetterStates(newLetterStates);

    if (newGuess === word) {
      setWon(true);
      setMessage("🎉 Gewonnen!");
    } else if (newGuesses.length >= maxGuesses) {
      setMessage(`Game Over! Het woord was: ${word}`);
      setWon(true);
    }

    setCurrentGuess("");
  };

  return (
    <div className="wordle-container">
      <div className="guesses">
        {Array.from({ length: maxGuesses }).map((_, i) => (
          <div key={i} className="guess-row">
            {Array.from({ length: word.length }).map((_, j) => {
              const letter =
                guesses[i]?.[j] ||
                (i === guesses.length ? currentGuess[j] : "");
              const state = guesses[i]
                ? getLetterState(guesses[i][j], guesses[i])
                : "";

              return (
                <div
                  key={j}
                  className={`letter-box ${state} ${letter ? "filled" : ""}`}
                >
                  {letter?.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {message && <p className="message">{message}</p>}

      {!won && (
        <div className="input-section">
          <input
            type="text"
            value={currentGuess.toUpperCase()}
            // onChange={(e) => setCurrentGuess(e.target.value.toLowerCase())}
            placeholder={`Voer een ${word.length}-letterwoord in`}
            maxLength={word.length}
            autoFocus
          />
          <button onClick={handleSubmitGuess}>Raad</button>
        </div>
      )}

      {won && (
        <div className="result">
          <h2>
            Woord: <span className="word-label">{word.toUpperCase()}</span>
          </h2>
          <p className="definition">{wordData.definition}</p>
          <a
            href={wordData.id}
            target="_blank"
            rel="noopener noreferrer"
            className="thesaurus-link"
          >
            Toon in CROW-Thesaurus →
          </a>
        </div>
      )}

      <div className="keyboard">
        <h3>Geraden letters:</h3>
        <div className="letter-grid">
          {Object.entries(letterStates).map(([letter, state]) => (
            <span key={letter} className={`letter-indicator ${state}`}>
              {letter.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordleGame;
