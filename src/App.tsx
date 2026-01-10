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

  const getDate = (): string => {
    const paramsString = window.location.search;
    const searchParams = new URLSearchParams(paramsString);
    const queryDate = searchParams.get("debugDate");

    if (queryDate !== null) return queryDate;

    const today = new Date();
    return today.toISOString().split("T")[0];
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
  const appDesc = `Raad dagelijks het woord uit de CROW-thesaurus – binnen zes pogingen.`;

  if (loading) {
    return (
      <div className="container">
        <h1>{appTitle}</h1>
        <p>{appDesc}</p>
        <p>Woord van de dag laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>{appTitle}</h1>
        <p>{appDesc}</p>
        <p className="error">Fout: {error}</p>
        <button onClick={fetchWordOfTheDay}>Probeer opnieuw</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>{appTitle}</h1>
      <p>{appDesc}</p>
      {wordData && <WordleGame wordData={wordData} />}
    </div>
  );
}

export default App;
