import { FC } from "react";
import "../styles/GameExplanation.css";

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
        <h1>{title}</h1>

        <div className="explanation-content">
          <p className="intro">{description}</p>

          <div className="rules-section">
            <h2>Spelregels</h2>
            <ol>
              <li>Typ een woord van de juiste lengte</li>
              <li>Druk op ⏎ om je gok in te dienen</li>
              <li>
                De kleur van elke letter verandert om aan te geven hoe dicht je
                bij het antwoord bent
              </li>
            </ol>
          </div>

          <div className="colors-section">
            <div className="color-explanation">
              <div className="color-box correct">
                <span className="letter">A</span>
              </div>
              <div className="color-text">
                <strong>Groen:</strong> De letter staat op de juiste plek
              </div>
            </div>

            <div className="color-explanation">
              <div className="color-box present">
                <span className="letter">B</span>
              </div>
              <div className="color-text">
                <strong>Geel:</strong> De letter komt voor in het woord, maar
                niet op deze plek
              </div>
            </div>

            <div className="color-explanation">
              <div className="color-box absent">
                <span className="letter">C</span>
              </div>
              <div className="color-text">
                <strong>Grijs:</strong> De letter staat niet in het woord
              </div>
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
