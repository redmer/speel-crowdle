// Cache for loaded word lists
const wordListCache: Record<number, Set<string>> = {};

/**
 * Load the allowed words list for a given word length
 * @param length The length of the word
 * @returns A Set of valid words for that length
 */
export const loadWordList = async (length: number): Promise<Set<string>> => {
  // Return from cache if already loaded
  if (wordListCache[length]) {
    return wordListCache[length];
  }

  try {
    const response = await fetch(`allowed-${length}.txt`);
    if (!response.ok) {
      console.error(`Failed to load word list for length ${length}`);
      return new Set();
    }

    const text = await response.text();
    const words = text
      .split("\n")
      .map((word) => word.trim().toLowerCase())
      .filter((word) => word.length > 0);

    const wordSet = new Set(words);
    wordListCache[length] = wordSet;
    return wordSet;
  } catch (error) {
    console.error(`Error loading word list for length ${length}:`, error);
    return new Set();
  }
};

/**
 * Check if a word is valid
 * @param word The word to validate
 * @param wordLength The expected length of valid words
 * @returns true if the word is valid, false otherwise
 */
export const isValidWord = async (
  word: string,
  wordLength: number
): Promise<boolean> => {
  const wordList = await loadWordList(wordLength);
  return wordList.has(word.toLowerCase());
};
