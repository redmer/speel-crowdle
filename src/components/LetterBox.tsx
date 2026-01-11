import { FC } from "react";

interface LetterBoxProps {
  letter: string;
  state: "correct" | "present" | "absent" | "";
  animationDelay?: string;
  isFilled?: boolean;
}

const LetterBox: FC<LetterBoxProps> = ({
  letter,
  state,
  animationDelay,
  isFilled,
}) => {
  return (
    <div
      className={`letter-box ${state} ${isFilled ? "filled" : ""} ${
        state ? "reveal" : ""
      }`}
      style={{ animationDelay }}
    >
      {letter?.toUpperCase()}
    </div>
  );
};

export default LetterBox;
