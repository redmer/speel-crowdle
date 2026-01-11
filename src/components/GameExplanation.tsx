import { FC } from "react";
import "../styles/GameExplanation.css";
import LetterBox from "./LetterBox";

interface GameExplanationProps {
  onStart: () => void;
  title: string;
  description: string;
}

const GameExplanation: FC<GameExplanationProps> = ({
  onStart,
  title,
  description,
}) => {
  return (
    <div className="explanation-overlay">
      <div className="explanation-modal">
        <h1>Hoe speel je {title}?</h1>

        <div className="explanation-content">
          <p className="intro">{description}</p>

          <div className="rules-section">
            <ul>
              <li>
                Elke poging moet een bestaand woord van de juiste lengte zijn
              </li>
              <li>
                De kleur van elke letter geeft aan hoe dicht je bij het antwoord
                bent
              </li>
            </ul>
          </div>

          <div className="colors-section">
            <div className="color-explanation">
              <div className="guess-row">
                <LetterBox letter="A" state="" />
                <LetterBox letter="P" state="" />
                <LetterBox letter="R" state="correct" />
                <LetterBox letter="I" state="" />
                <LetterBox letter="L" state="" />
              </div>
              <p>
                Deze <strong>R</strong> staat op de juiste plek
              </p>
            </div>

            <div className="color-explanation">
              <div className="guess-row">
                <LetterBox letter="M" state="" />
                <LetterBox letter="A" state="present" />
                <LetterBox letter="A" state="" />
                <LetterBox letter="R" state="" />
                <LetterBox letter="T" state="" />
              </div>
              <p>
                Eén <strong>A</strong> komt voor, maar niet op de 2e of 3e
                plaats.
              </p>
            </div>

            <div className="color-explanation">
              <div className="guess-row">
                <LetterBox letter="Z" state="absent" />
                <LetterBox letter="O" state="" />
                <LetterBox letter="M" state="" />
                <LetterBox letter="E" state="" />
                <LetterBox letter="R" state="" />
              </div>
              <p>
                <strong>Z</strong> komt niet in het woord voor.
              </p>
            </div>
          </div>

          <p>
            Als je het na zes pogingen niet hebt, krijg je nog één extra poging
            met een hint! 💡
          </p>
        </div>

        <button className="start-button" onClick={onStart}>
          Spelen →
        </button>
      </div>
    </div>
  );
};

export default GameExplanation;
