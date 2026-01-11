import { FC, useState } from "react";
import "../styles/ShareButton.css";

interface ShareButtonProps {
  guesses: string[];
  word: string;
  maxGuesses: number;
  type: "share" | "copy";
}

const ShareButton: FC<ShareButtonProps> = ({
  guesses,
  word,
  maxGuesses,
  type,
}) => {
  const [notificationText, setNotificationText] = useState<string>("");

  const getLetterState = (
    letter: string,
    position: number,
    guessWord: string,
    word: string
  ): "correct" | "present" | "absent" => {
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

  const generateShareText = (): string => {
    const emoji = {
      correct: "🟩",
      present: "🟨",
      absent: "⬜",
    };

    let today = new Date();

    let shareText = `${today.toLocaleDateString(undefined, {
      weekday: undefined,
    })}\n\n`;

    // Add colored squares for each guess
    for (const guess of guesses) {
      let row = "";
      for (let j = 0; j < guess.length; j++) {
        const state = getLetterState(guess[j], j, guess, word);
        row += emoji[state];
      }
      shareText += row + "\n";
    }

    // Add score
    const totalGuesses = guesses.length;
    shareText += `\n${totalGuesses}/${maxGuesses}\n\n`;

    // Add link to self
    shareText += window.location.href;

    return shareText;
  };

  const handleShare = async (): Promise<void> => {
    const shareText = generateShareText();

    // Check if navigator.share is available
    if (type == "share") {
      try {
        await navigator.share({
          title: "CROWdle",
          text: shareText,
        });
      } catch (err) {
        // User cancelled share
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        setNotificationText("Gekopieerd!");
        setTimeout(() => setNotificationText(""), 2000);
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
        setNotificationText("Kopiëren mislukt");
        setTimeout(() => setNotificationText(""), 2000);
      }
    }
  };

  if (type == "copy") {
    return (
      <button className="share-button" onClick={handleShare}>
        {notificationText || "Kopieer resultaat"}
      </button>
    );
  }

  if (type == "share") {
    if (navigator.canShare && navigator.canShare({ text: "string" })) {
      return (
        <button
          className="share-button"
          onClick={handleShare}
          title="Deel je resultaten"
        >
          {notificationText || "Deel resultaat"}
        </button>
      );
    }
  }
};

export default ShareButton;
