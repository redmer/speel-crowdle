import { FC, useEffect, useState } from "react";
import "../styles/WordleGame.css";
import {
  getGameState,
  getGameStats,
  saveGameState,
  saveGameStats,
} from "../utils/gameStorage";
import type { XsdDate } from "../utils/isoDateHelper";
import { loadWordList } from "../utils/wordValidation";
import GameExplanation from "./GameExplanation";
import GameFinished from "./GameFinished";
import LetterBox from "./LetterBox";
import VirtualKeyboard from "./VirtualKeyboard";

export interface WordData {
  term_id: string;
  answer: string;
  definition?: string;
  answer_len: string;
  answer_hint?: string;
  for_date: XsdDate;
}

export interface GameFinishData {
  guesses: string[];
  playerWon: boolean;
  gamesWon: number;
  gamesPlayed: number;
}

interface WordleGameProps {
  wordData: WordData;
  onGameFinish: (data: GameFinishData) => void;
}

type LetterState = "correct" | "present" | "absent";
type LetterStates = Record<string, LetterState>;

const WordleGame: FC<WordleGameProps> = ({ wordData, onGameFinish }) => {
  const INITIAL_GUESSES = 6;
  const TRUE_MAX_GUESSES = 7;

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameIsFinished, setGameIsFinished] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [letterStates, setLetterStates] = useState<LetterStates>({});
  const [currentMaxGuesses, setMaxGuesses] = useState<number>(INITIAL_GUESSES);
  const [gamesWon, setGamesWon] = useState<number>(0);
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);
  const [validWords, setValidWords] = useState<Set<string> | null>(null);
  const [isInvalidGuess, setIsInvalidGuess] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showFinished, setShowFinished] = useState<boolean>(false);
  const [playerWon, setPlayerWon] = useState<boolean>(false);

  const word = wordData.answer.toLowerCase();
  const dateKey = wordData.for_date;

  // Load stats from localStorage on component mount
  useEffect(() => {
    const stats = getGameStats();
    setGamesWon(stats.gamesWon);
    setGamesPlayed(stats.gamesPlayed);

    // Check if game was already played today and load state
    const savedGame = getGameState(dateKey);
    if (savedGame) {
      setGuesses(savedGame.guesses);
      setPlayerWon(true);
      setGameIsFinished(savedGame.finished);
      setMessage("🎉 Gewonnen!");

      onGameFinish({
        gamesPlayed: stats.gamesPlayed,
        gamesWon: stats.gamesWon,
        playerWon: savedGame.won,
        guesses: savedGame.guesses,
      });
    }

    // Load the word list for validation
    loadWordList(word.length).then(setValidWords);
  }, [dateKey, word.length]);

  const transformToLigature = (input: string): string => {
    // Replace consecutive i+j with the IJ ligature
    return input.toLowerCase().replace(/ij/g, "Ĳ");
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (gameIsFinished) return;

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

    self.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentGuess, gameIsFinished, word]);

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
    if (gameIsFinished) return;
    if (currentGuess.length <= word.length) {
      const newGuess = currentGuess + letter.toLowerCase();
      const transformed = transformToLigature(newGuess);
      if (transformed.length <= word.length) {
        setCurrentGuess(transformed);
      }
    }
  };

  const handleBackspaceClick = (): void => {
    if (gameIsFinished) return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  const handleSubmitGuess = (): void => {
    if (currentGuess.length !== word.length) {
      setMessage(`Woord moet ${word.length} letters lang zijn`);
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    // Check if the word is valid
    if (!validWords || !validWords.has(currentGuess.toLowerCase())) {
      setIsInvalidGuess(true);
      setMessage("Woord niet herkend");
      setTimeout(() => {
        setIsInvalidGuess(false);
        setMessage("");
      }, 2000);
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
        setGameIsFinished(true);
        setPlayerWon(true);
        setMessage("🎉 Gewonnen!");

        // Save game state and update stats
        const newStats = {
          gamesWon: gamesWon + 1,
          gamesPlayed: gamesPlayed + 1,
        };
        saveGameState({
          date: dateKey,
          word: word,
          guesses: newGuesses,
          won: true,
          finished: true,
          finishedAt: Date.now(),
        });
        saveGameStats(newStats);
        setGamesWon(newStats.gamesWon);
        setGamesPlayed(newStats.gamesPlayed);
        onGameFinish({
          guesses: newGuesses,
          playerWon: true,
          gamesWon: newStats.gamesWon,
          gamesPlayed: newStats.gamesPlayed,
        });
      }, totalAnimationTime);
    } else if (newGuesses.length >= TRUE_MAX_GUESSES) {
      setTimeout(() => {
        setGameIsFinished(true);
        setMessage(`Game Over! Het woord was: ${word}`);

        // Save game state and update stats
        const newStats = { gamesWon: gamesWon, gamesPlayed: gamesPlayed + 1 };
        saveGameState({
          date: dateKey,
          word: word,
          guesses: newGuesses,
          won: false,
          finished: true,
          finishedAt: Date.now(),
        });
        saveGameStats(newStats);
        setGamesPlayed(newStats.gamesPlayed);
        onGameFinish({
          guesses: newGuesses,
          playerWon: false,
          gamesWon: gamesWon,
          gamesPlayed: newStats.gamesPlayed,
        });
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
      <div className="topbar">
        <h1 className="game-title">CROWdle</h1>
        <div className="topbar-buttons">
          <button
            className="topbar-button help-button"
            onClick={() => setShowExplanation(true)}
            title="Help"
          >
            ❓
          </button>
          {playerWon && (
            <button
              className="topbar-button finished-button"
              onClick={() => setShowFinished(true)}
              title="Resultaten"
            >
              📊
            </button>
          )}
        </div>
      </div>

      <div className="guesses">
        {Array.from({ length: currentMaxGuesses }).map((_, i) => (
          <div key={i} className="guess-row">
            {Array.from({ length: word.length }).map((_, j) => {
              const letter =
                guesses[i]?.[j] ||
                (i === guesses.length ? currentGuess[j] : "");
              const state = guesses[i]
                ? getLetterState(guesses[i][j], j, guesses[i])
                : isInvalidGuess && i === guesses.length
                ? "invalid"
                : "";
              const isRevealed = !!guesses[i];
              const animationDelay = isRevealed ? `${j * 0.2}s` : "0s";

              return (
                <LetterBox
                  key={j}
                  letter={letter}
                  state={state}
                  animationDelay={animationDelay}
                  isFilled={!!letter}
                />
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

      {!gameIsFinished && (
        <VirtualKeyboard
          letterStates={letterStates}
          onLetterClick={handleLetterClick}
          onBackspaceClick={handleBackspaceClick}
          onSubmitGuess={handleSubmitGuess}
          disabled={gameIsFinished}
        />
      )}

      {showExplanation && (
        <GameExplanation
          title="Crowdle"
          description="Raad het begrip in 6 pogingen. De kleur van de tegels verandert na elke gok."
          onStart={() => setShowExplanation(false)}
        />
      )}

      {showFinished && (
        <GameFinished
          termId={wordData.term_id}
          definition={wordData.definition}
          guesses={guesses}
          word={word}
          date={dateKey}
          playerWon={playerWon}
          gamesWon={gamesWon}
          gamesPlayed={gamesPlayed}
          onClose={() => setShowFinished(false)}
        />
      )}
    </div>
  );
};

export default WordleGame;
