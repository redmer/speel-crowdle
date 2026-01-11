import { FC } from "react";

interface KeyButtonProps {
  letter?: string;
  onClick: () => void;
  disabled: boolean;
  className: string;
  letterState?: string;
  isSpecial?: boolean;
}

const KeyButton: FC<KeyButtonProps> = ({
  letter,
  onClick,
  disabled,
  className,
  letterState,
  isSpecial,
}) => {
  return (
    <button
      className={`key ${className} ${letterState || ""} ${
        isSpecial ? "special" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {letter}
    </button>
  );
};

export default KeyButton;
