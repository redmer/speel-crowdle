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
export const isValidWord = async (word: string): Promise<boolean> => {
  const lowerWord = word.toLowerCase();
  const wordLength = lowerWord.length;

  // First, check if the full word exists in the main dictionary
  const wordList = await loadWordList(wordLength);
  if (wordList.has(lowerWord)) {
    console.log(`Guess ${word.toUpperCase()}: in word list`);
    return true;
  }

  // If not found and it's a combinable length (e.g., 2+ characters),
  // check all possible combinations of smaller allowed words
  for (let i = 1; i < wordLength; i++) {
    const leftPart = lowerWord.slice(0, i);
    const rightPart = lowerWord.slice(i, wordLength);

    const leftList = await loadWordList(leftPart.length);
    const rightList = await loadWordList(rightPart.length);

    if (leftList.has(leftPart) && rightList.has(rightPart)) {
      console.log(
        `Guess ${word.toUpperCase()}: allowed as ${leftPart.toUpperCase()} + ${rightPart.toUpperCase()}`,
      );
      return true;
    }
  }

  console.log(`Guess ${word.toUpperCase()} disallowed`);
  return false;
};
