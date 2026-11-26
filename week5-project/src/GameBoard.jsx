import Row from "./Row";
import { MAX_GUESSES } from "./utils/wordlelogic";

function GameBoard({ pastGuesses, currentGuess, solutionWord, gameStatus }) {
  const activeRowIndex =
    gameStatus === "IN_PROGRESS" ? pastGuesses.length : -1;

  return (
    <main className="board" aria-label="Wordle game board">
      {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
        const isSubmitted = rowIndex < pastGuesses.length;
        const isActiveRow = rowIndex === activeRowIndex;

        const rowGuess = isSubmitted
          ? pastGuesses[rowIndex]
          : isActiveRow
          ? currentGuess
          : "";

        return (
          <Row
            key={rowIndex}
            guess={rowGuess}
            solution={solutionWord}
            isSubmitted={isSubmitted}
          />
        );
      })}
    </main>
  );
}

export default GameBoard;