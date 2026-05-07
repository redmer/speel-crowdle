// Cache for loaded word lists (promises to avoid duplicate fetches)
const wordListCache: Record<number, Promise<Set<string>>> = {};

/**
 * Load the allowed words list for a given word length
 * @param length The length of the word
 * @returns A Set of valid words for that length
 */
export const loadWordList = async (length: number): Promise<Set<string>> => {
  // Return from cache if already loading or loaded
  if (await wordListCache[length]) {
    return wordListCache[length];
  }

  wordListCache[length] = (async () => {
    try {
      const response = await fetch(`allowed-${length}.txt`);
      if (!response.ok) {
        console.error(`Failed to load word list for length ${length}`);
        return new Set<string>();
      }

      const text = await response.text();
      const words = text
        .split("\n")
        .map((word) => word.trim().toLowerCase())
        .filter((word) => word.length > 0);

      return new Set(words);
    } catch (error) {
      console.error(`Error loading word list for length ${length}:`, error);
      return new Set<string>();
    }
  })();

  return wordListCache[length];
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

  // Pre-load all necessary word lists concurrently to speed up checks
  const requiredLengths = new Set<number>();
  for (let i = 1; i < wordLength; i++) {
    requiredLengths.add(i);
    requiredLengths.add(wordLength - i);
  }
  await Promise.all(
    Array.from(requiredLengths).map((length) => loadWordList(length)),
  );

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
