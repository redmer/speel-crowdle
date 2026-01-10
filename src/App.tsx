interface WordData {
  id: string;
  label: string;
  definition: string;
  strlen: string;
}

import { useEffect, useState } from "react";
// import "./App.css";
import WordleGame from "./components/WordleGame";

function App(): JSX.Element {
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWordOfTheDay();
  }, []);

  const fetchWordOfTheDay = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const dateString = today.toISOString().split("T")[0];

      const url = `https://api.datasets.crow.nl/queries/redmer-kronemeijer/thesaurus-wordle/run?today=${dateString}`;

      const response = await fetch(url, {
        headers: {
          //   "User-Agent": "ThesaurusWordle/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: WordData = await response.json();
      setWordData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Failed to fetch word:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h1>Thesaurus Wordle</h1>
        <p>Loading word of the day...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>Thesaurus Wordle</h1>
        <p className="error">Error: {error}</p>
        <button onClick={fetchWordOfTheDay}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Thesaurus Wordle</h1>
      {wordData && <WordleGame wordData={wordData} />}
    </div>
  );
}

export default App;
