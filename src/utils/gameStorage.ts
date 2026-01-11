export interface GameState {
  date: string;
  word: string;
  guesses: string[];
  won: boolean;
  finished: boolean;
  finishedAt?: number; // timestamp when game was finished
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
}

const STORAGE_KEY_PREFIX = "crowdle_game_";
const STATS_KEY = "crowdle_stats";

/**
 * Get the storage key for a specific date
 */
function getGameKey(date: string): string {
  return STORAGE_KEY_PREFIX + date;
}

/**
 * Save game state for a specific date
 */
export function saveGameState(gameState: GameState): void {
  try {
    const key = getGameKey(gameState.date);
    localStorage.setItem(key, JSON.stringify(gameState));
  } catch (error) {
    console.error("Failed to save game state:", error);
  }
}

/**
 * Get game state for a specific date
 */
export function getGameState(date: string): GameState | null {
  try {
    const key = getGameKey(date);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to get game state:", error);
    return null;
  }
}

/**
 * Get all saved game states
 */
export function getAllGameStates(): GameState[] {
  try {
    const states: GameState[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          states.push(JSON.parse(stored));
        }
      }
    }
    return states.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Failed to get all game states:", error);
    return [];
  }
}

/**
 * Save game stats
 */
export function saveGameStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Failed to save game stats:", error);
  }
}

/**
 * Get game stats
 */
export function getGameStats(): GameStats {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    return stored ? JSON.parse(stored) : { gamesPlayed: 0, gamesWon: 0 };
  } catch (error) {
    console.error("Failed to get game stats:", error);
    return { gamesPlayed: 0, gamesWon: 0 };
  }
}

/**
 * Get games from the last N days
 */
export function getGameStatesFromLastDays(days: number): GameState[] {
  const allStates = getAllGameStates();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return allStates.filter((state) => new Date(state.date) >= cutoffDate);
}

/**
 * Check if a game was missed (not played) on a given date
 */
export function isMissedGame(date: string): boolean {
  return getGameState(date) === null;
}
