import { FC, useEffect, useState } from "react";
import "../styles/WordleGame.css";
import ShareButton from "./ShareButton";

export interface WordData {
  term_id: string;
  answer: string;
  definition?: string;
  answer_len: string;
  answer_hint?: string;
}

interface WordleGameProps {
  wordData: WordData;
}

type LetterState = "correct" | "present" | "absent";
type LetterStates = Record<string, LetterState>;

const WordleGame: FC<WordleGameProps> = ({ wordData }) => {
  const INITIAL_GUESSES = 6;
  const TRUE_MAX_GUESSES = 7;

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [won, setWon] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [letterStates, setLetterStates] = useState<LetterStates>({});
  const [currentMaxGuesses, setMaxGuesses] = useState<number>(INITIAL_GUESSES);

  const word = wordData.answer.toLowerCase();

  const transformToLigature = (input: string): string => {
    // Replace consecutive i+j with the IJ ligature
    return input.toLowerCase().replace(/ij/g, "Ĳ");
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (won) return;

      if (e.key === "Enter") {
        handleSubmitGuess();
      } else if (e.key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[a-zñ]$/i.test(e.key)) {
        if (currentGuess.length <= word.length) {
          const newGuess = currentGuess + e.key.toLowerCase();
          // Transform ij to Ĳ
          const transformed = transformToLigature(newGuess);
          if (transformed.length <= word.length) {
            setCurrentGuess(transformed);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentGuess, won, word]);

  const getLetterState = (
    letter: string,
    position: number,
    guessWord: string
  ): LetterState => {
    // Correct position
    if (word[position] === letter) {
      return "correct";
    }

    // Count available instances of this letter in the word
    let wordLetterCount = 0;
    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) {
        wordLetterCount++;
      }
    }

    // Count how many instances of this letter are already matched as "correct"
    let correctMatches = 0;
    for (let i = 0; i < guessWord.length; i++) {
      if (guessWord[i] === letter && word[i] === letter) {
        correctMatches++;
      }
    }

    // Count how many instances we've already marked as "present" before this position
    let presentMatches = 0;
    for (let i = 0; i < position; i++) {
      if (
        guessWord[i] === letter &&
        word[i] !== letter &&
        word.includes(letter)
      ) {
        presentMatches++;
      }
    }

    // If there are available instances (not used by correct or previous present matches), mark as present
    if (
      word.includes(letter) &&
      correctMatches + presentMatches < wordLetterCount
    ) {
      return "present";
    }

    // Not in word or all instances are already used
    return "absent";
  };

  const handleLetterClick = (letter: string): void => {
    if (won) return;
    if (currentGuess.length < word.length) {
      const newGuess = currentGuess + letter.toLowerCase();
      const transformed = transformToLigature(newGuess);
      if (transformed.length <= word.length) {
        setCurrentGuess(transformed);
      }
    }
  };

  const handleBackspaceClick = (): void => {
    if (won) return;
    setCurrentGuess((prev) => prev.slice(0, -1));
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
      const state = getLetterState(letter, i, newGuess);
      if (state === "correct") {
        newLetterStates[letter] = "correct";
      } else if (state === "present" && newLetterStates[letter] !== "correct") {
        newLetterStates[letter] = "present";
      } else if (state === "absent" && !newLetterStates[letter]) {
        newLetterStates[letter] = "absent";
      }
    }
    setLetterStates(newLetterStates);

    // Calculate total animation time: last letter's delay + animation duration (0.75s)
    const animationDuration = 0.75; // seconds
    const lastLetterDelay = (word.length - 1) * 0.1; // seconds
    const totalAnimationTime = (lastLetterDelay + animationDuration) * 1000; // convert to ms

    if (newGuess === word) {
      setTimeout(() => {
        setWon(true);
        setMessage("🎉 Gewonnen!");
      }, totalAnimationTime);
    } else if (newGuesses.length >= TRUE_MAX_GUESSES) {
      setTimeout(() => {
        setWon(true);
        setMessage(`Game Over! Het woord was: ${word}`);
      }, totalAnimationTime);
    } else if (newGuesses.length >= INITIAL_GUESSES) {
      setTimeout(() => {
        setMessage(
          `Ai, dat was je laatste kans! Goed, nog één poging dan… 
          ${wordData.answer_hint ? "hint: " + wordData.answer_hint + "." : ""}
          `
        );
        setMaxGuesses(TRUE_MAX_GUESSES);
      }, totalAnimationTime);
    }

    setCurrentGuess("");
  };

  return (
    <div className="wordle-container">
      <div className="guesses">
        {Array.from({ length: currentMaxGuesses }).map((_, i) => (
          <div key={i} className="guess-row">
            {Array.from({ length: word.length }).map((_, j) => {
              const letter =
                guesses[i]?.[j] ||
                (i === guesses.length ? currentGuess[j] : "");
              const state = guesses[i]
                ? getLetterState(guesses[i][j], j, guesses[i])
                : "";
              const isRevealed = !!guesses[i];
              const animationDelay = isRevealed ? `${j * 0.2}s` : "0s";

              return (
                <div
                  key={j}
                  className={`letter-box ${state} ${letter ? "filled" : ""} ${
                    isRevealed ? "reveal" : ""
                  }`}
                  style={{ animationDelay }}
                >
                  {letter?.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {message && (
        <p
          className="message"
          dangerouslySetInnerHTML={{ __html: message }}
        ></p>
      )}

      {/* Remove the input, as it's redundant with the virtual keyboard. */}
      {/* {!won && (
        <div className="input-section">
          <input
            type="text"
            value={currentGuess.toUpperCase()}
            placeholder={`Voer een ${word.length}-letterwoord in`}
            autoFocus
          />
          <button onClick={handleSubmitGuess}>Raad</button>
        </div>
      )} */}

      {won && (
        <div className="result">
          <h2>
            Woord: <span className="word-label">{word.toUpperCase()}</span>
          </h2>
          <p className="definition">{wordData.definition}</p>
          <div className="result-actions">
            <a
              href={wordData.term_id}
              target="_blank"
              rel="noopener noreferrer"
              className="thesaurus-link"
            >
              Toon in CROW-Begrippen →
            </a>
            <ShareButton
              guesses={guesses}
              word={word}
              maxGuesses={currentMaxGuesses}
              type="copy"
            />
            <ShareButton
              guesses={guesses}
              word={word}
              maxGuesses={currentMaxGuesses}
              type="share"
            />
          </div>
        </div>
      )}

      {!won && (
        <div className="virtual-keyboard">
          <div className="keyboard-row">
            {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map(
              (letter) => (
                <button
                  key={letter}
                  className={`key ${letterStates[letter.toLowerCase()] || ""}`}
                  onClick={() => handleLetterClick(letter)}
                  disabled={won}
                >
                  {letter}
                </button>
              )
            )}
          </div>
          <div className="keyboard-row">
            <div className="half-key" />
            {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((letter) => (
              <button
                key={letter}
                className={`key ${letterStates[letter.toLowerCase()] || ""}`}
                onClick={() => handleLetterClick(letter)}
                disabled={won}
              >
                {letter}
              </button>
            ))}
            <div className="half-key" />
          </div>
          <div className="keyboard-row">
            <button
              className="key special enter"
              onClick={handleSubmitGuess}
              disabled={won}
            >
              ⏎
            </button>
            {["Z", "X", "C", "V", "B", "N", "M"].map((letter) => (
              <button
                key={letter}
                className={`key ${letterStates[letter.toLowerCase()] || ""}`}
                onClick={() => handleLetterClick(letter)}
                disabled={won}
              >
                {letter}
              </button>
            ))}
            <button
              className="key special backspace"
              onClick={handleBackspaceClick}
              disabled={won}
            >
              ⌫
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordleGame;
