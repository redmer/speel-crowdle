import { useEffect, useState, type JSX } from "react";
import GameExplanation from "./components/GameExplanation.tsx";
import GameFinished from "./components/GameFinished.tsx";
import type { GameFinishData, WordData } from "./components/WordleGame.tsx";
import WordleGame from "./components/WordleGame.tsx";
import { getGameState } from "./utils/gameStorage.ts";
import { toXsdDate, type XsdDate } from "./utils/isoDateHelper.ts";

function App(): JSX.Element {
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(true);
  const [gameFinishData, setGameFinishData] = useState<GameFinishData | null>(
    null
  );

  useEffect(() => {
    fetchWordOfTheDay();
  }, []);

  const getDate = (): XsdDate => {
    const paramsString = window.location.search;
    const searchParams = new URLSearchParams(paramsString);
    const queryDate = searchParams.get("date");

    if (queryDate !== null)
      return queryDate + (queryDate.includes("Z") ? "" : "Z");

    const today = new Date();
    return toXsdDate(today);
  };

  const shouldSkipExplanation = (): boolean => {
    const dateString = getDate();
    const savedGame = getGameState(dateString);
    return savedGame !== null && savedGame.finished;
  };

  const fetchWordOfTheDay = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Get today's date in YYYY-MM-DD format
      const dateString = getDate();

      const url = `https://api.datasets.crow.nl/queries/redmer-kronemeijer/thesaurus-wordle/run?today=${dateString}`;

      const response = await fetch(url, {
        headers: {
          //   "User-Agent": "ThesaurusWordle/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`API-fout: ${response.status}`);
      }

      const data: WordData = await response.json();
      setWordData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Onbekende fout";
      setError(errorMessage);
      console.error("Failed to fetch word:", err);
    } finally {
      setLoading(false);
    }
  };

  const appTitle = `CROWdle`;
  const appDesc = `Raad dagelijks het CROW-begrip van de dag – binnen zes pogingen.`;
  if (showExplanation && !shouldSkipExplanation()) {
    return (
      <div className="container">
        <GameExplanation
          onStart={() => setShowExplanation(false)}
          title={appTitle}
          description={appDesc}
        />
      </div>
    );
  }
  if (loading) {
    return (
      <div className="container">
        <header>
          <h1>{appTitle}</h1>
          <p>{appDesc}</p>
        </header>
        <p>Woord van de dag laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <header>
          <h1>{appTitle}</h1>
          <p>{appDesc}</p>
        </header>
        <p className="error">Fout: {error}</p>
        <button onClick={fetchWordOfTheDay}>Probeer opnieuw</button>
      </div>
    );
  }

  return (
    <div className="container">
      {wordData && (
        <WordleGame
          wordData={wordData}
          onGameFinish={(data: GameFinishData) => {
            console.log(data);
            setGameFinishData(data);
          }}
        />
      )}

      {wordData && gameFinishData && (
        <GameFinished
          termId={wordData.term_id}
          definition={wordData.definition}
          guesses={gameFinishData.guesses}
          word={wordData.answer.toLowerCase()}
          date={wordData.for_date}
          playerWon={gameFinishData.playerWon}
          gamesWon={gameFinishData.gamesWon}
          gamesPlayed={gameFinishData.gamesPlayed}
          onClose={() => setGameFinishData(null)}
        />
      )}
    </div>
  );
}

export default App;
