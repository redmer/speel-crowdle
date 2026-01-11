import { FC } from "react";
import KeyButton from "./KeyButton";

interface VirtualKeyboardProps {
  letterStates: Record<string, string>;
  onLetterClick: (letter: string) => void;
  onBackspaceClick: () => void;
  onSubmitGuess: () => void;
  disabled: boolean;
}

const VirtualKeyboard: FC<VirtualKeyboardProps> = ({
  letterStates,
  onLetterClick,
  onBackspaceClick,
  onSubmitGuess,
  disabled,
}) => {
  const renderKeyRow = (letters: string[]) =>
    letters.map((letter) => (
      <KeyButton
        key={letter}
        letter={letter}
        onClick={() => onLetterClick(letter)}
        disabled={disabled}
        className=""
        letterState={letterStates[letter.toLowerCase()] || ""}
      />
    ));

  return (
    <div className="virtual-keyboard">
      <div className="keyboard-row">
        {renderKeyRow(["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"])}
      </div>

      <div className="keyboard-row">
        <div className="half-key" />
        {renderKeyRow(["A", "S", "D", "F", "G", "H", "J", "K", "L"])}
        <div className="half-key" />
      </div>

      <div className="keyboard-row">
        <KeyButton
          letter="⏎"
          onClick={onSubmitGuess}
          disabled={disabled}
          className="enter"
          isSpecial={true}
        />
        {renderKeyRow(["Z", "X", "C", "V", "B", "N", "M"])}
        <KeyButton
          letter="⌫"
          onClick={onBackspaceClick}
          disabled={disabled}
          className="backspace"
          isSpecial={true}
        />
      </div>
    </div>
  );
};

export default VirtualKeyboard;
