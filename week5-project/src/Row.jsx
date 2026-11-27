import Tile from "./tile";
import { WORD_LENGTH, evaluateGuess } from "./utils/wordlelogic";

function Row({ guess = "", solution = "", isSubmitted = false }) {
  const tileResults = isSubmitted ? evaluateGuess(guess, solution) : [];
  const rowTiles = [];

  for (let slot = 0; slot < WORD_LENGTH; slot++) {
    const ch = guess.charAt(slot) || "";
    const tileStatus = isSubmitted ? tileResults[slot] || "" : "";
    rowTiles.push(<Tile key={slot} letter={ch} status={tileStatus} />);
  }

  return (
    <div className="row" role="group" aria-label="Guess row">
      {rowTiles}
    </div>
  );
}

export default Row;