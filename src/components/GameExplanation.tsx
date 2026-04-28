import { FC } from "react";
import "../styles/GameExplanation.css";
import LetterBox from "./LetterBox";
import Modal from "./Modal";

interface GameExplanationProps {
  onStart: () => void;
}

const GameExplanation: FC<GameExplanationProps> = ({ onStart }) => {
  return (
    <Modal
      title={`Hoe speel je CROWdle?`}
      showCloseButton={true}
      onClose={onStart}
    >
      <div className="explanation-content">
        <p className="intro">
          {/* Raad dagelijks het CROW-begrip van de dag – binnen zes pogingen. */}
        </p>

        <div className="rules-section">
          <ul>
            <li>Raad binnen 6 pogingen het CROW-begrip van de dag.</li>
            <li>
              Elke poging moet een bestaand
              <a
                style={{ textDecoration: "none" }}
                href="https://www.opentaal.org/"
                target="_blank"
              >
                *
              </a>{" "}
              woord zijn.
            </li>
            <li>
              De kleur van elke letter geef aan hoe dicht je bij het antwoord
              was:
            </li>
          </ul>
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
                Deze <strong>R</strong> staat op de juiste plek.
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
                Eén <strong>A</strong> komt voor, maar niet op de 2e of 3e (!)
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
        </div>
      </div>

      <button className="start-button" autoFocus onClick={onStart}>
        Speel →
      </button>
    </Modal>
  );
};

export default GameExplanation;
