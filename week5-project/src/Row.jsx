import Tile from "./tile";
import { WORD_LENGTH, evaluateGuess } from "./utils/wordlelogic";

function Row({ guess = "", solution = "", isSubmitted = false }) {
  const evaluations = isSubmitted ? evaluateGuess(guess, solution) : [];

  return (
    <div className="row" role="group" aria-label="Guess row">
      {Array.from({ length: WORD_LENGTH }).map((_, index) => {
        const letter = guess[index] || "";
        const status = isSubmitted ? evaluations[index] : "";
        return <Tile key={index} letter={letter} status={status} />;
      })}
    </div>
  );
}

export default Row;