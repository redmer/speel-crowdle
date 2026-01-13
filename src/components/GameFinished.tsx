import { FC, useEffect, useState } from "react";
import "../styles/GameFinished.css";
import {
  GameState,
  getGameStatesFromLastDays,
  isMissedGame,
} from "../utils/gameStorage";
import { fromXsdDate, toXsdDate, type XsdDate } from "../utils/isoDateHelper";
import Modal from "./Modal";
import ResultActions from "./ResultActions";
import ShareButton from "./ShareButton";

interface GameFinishedProps {
  termId: string;
  definition?: string;
  guesses: string[];
  word: string;
  date: XsdDate;
  playerWon: boolean;
  gamesWon: number;
  gamesPlayed: number;
  onClose: () => void;
}

const GameFinished: FC<GameFinishedProps> = ({
  termId,
  definition,
  guesses,
  word,
  date,
  playerWon,
  gamesWon,
  gamesPlayed,
  onClose,
}) => {
  const [pastGames, setPastGames] = useState<GameState[]>([]);
  const [missedDates, setMissedDates] = useState<string[]>([]);
  const [showPastGames, setShowPastGames] = useState(false);

  useEffect(() => {
    // Get games from the last 7 days
    const games = getGameStatesFromLastDays(7);
    setPastGames(games);

    // Find missed games in the last 7 days
    const missed: string[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = toXsdDate(checkDate);

      // Don't count today if it's still in progress
      if (dateStr === date) continue;

      if (isMissedGame(dateStr)) {
        missed.push(dateStr);
      }
    }
    setMissedDates(missed);
  }, [date]);

  return (
    <Modal onClose={onClose} showCloseButton={true}>
      <div className="game-finished-container">
        <div className="game-finished-header">
          {playerWon ? (
            <>
              <h1 className="celebration">🎉 Gewonnen!</h1>
              <p className="congratulations">
                Gefeliciteerd! Je hebt het woord in{" "}
                <strong>{guesses.length}</strong> poging
                {guesses.length !== 1 ? "en" : ""} gevonden.
              </p>
            </>
          ) : (
            <>
              <h1 className="game-over">Game Over</h1>
            </>
          )}
        </div>

        <ResultActions termId={termId} definition={definition} word={word} />

        <div className="share-box">
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

        <div className="stats-box">
          <div className="stat">
            <div className="stat-number">{gamesPlayed}</div>
            <div className="stat-label">Gespeeld</div>
          </div>
          <div className="stat">
            <div className="stat-number">{gamesWon}</div>
            <div className="stat-label">Gewonnen</div>
          </div>
          <div className="stat">
            <div className="stat-percentage">
              {gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0}
              %
            </div>
            <div className="stat-label">Winrate</div>
          </div>
        </div>

        {(pastGames.length > 1 || missedDates.length > 0) && (
          <div className="past-games-section">
            <button
              className="toggle-past-games"
              onClick={() => setShowPastGames(!showPastGames)}
            >
              {showPastGames ? "▼" : "▶"} Eerdere spellen (
              {pastGames.length + missedDates.length})
            </button>

            {showPastGames && (
              <div className="past-games-list">
                {pastGames.map((game) => (
                  <div key={game.date} className="past-game-item">
                    <div className="past-game-date">
                      {fromXsdDate(game.date).toLocaleDateString("nl-NL", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="past-game-word">
                      {game.word.toUpperCase()}
                    </div>
                    <div
                      className={`past-game-status ${
                        game.won ? "won" : "lost"
                      }`}
                    >
                      {game.won ? `${game.guesses.length}/${6}` : "X/6"}
                    </div>
                  </div>
                ))}

                {missedDates.map((missedDate) => (
                  <div key={missedDate} className="past-game-item missed">
                    <div className="past-game-date">
                      {fromXsdDate(missedDate).toLocaleDateString("nl-NL", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="past-game-word">—</div>
                    <a
                      href={`?date=${missedDate}`}
                      className="play-missed-link"
                      title="Speel dit woord"
                    >
                      Spelen →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GameFinished;
