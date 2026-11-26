import { useCallback, useEffect, useMemo, useState } from "react";
import GameBoard from "./GameBoard";
import Keyboard from "./keyboard";
import {
  MAX_GUESSES,
  WORD_LENGTH,
  getKeyboardStatuses,
  getRandomWord,
} from "./utils/wordlelogic";
import "./index.css";

function App() {
  const [solutionWord, setSolutionWord] = useState(() => getRandomWord());
  const [currentGuess, setCurrentGuess] = useState("");
  const [pastGuesses, setPastGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState("IN_PROGRESS");
  const [bannerMessage, setBannerMessage] = useState("");

  const keyStatuses = useMemo(
    () => getKeyboardStatuses(pastGuesses, solutionWord),
    [pastGuesses, solutionWord]
  );

  const handleKeyPress = useCallback(
    (rawKey) => {
      if (gameStatus !== "IN_PROGRESS") return;

      const key = rawKey.toUpperCase();
      setBannerMessage("");

      if (key === "BACKSPACE" || key === "DELETE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }

      if (key === "ENTER") {
        if (currentGuess.length < WORD_LENGTH) {
          setBannerMessage(`Enter ${WORD_LENGTH} letters first.`);
          return;
        }

        const nextGuesses = [...pastGuesses, currentGuess];
        setPastGuesses(nextGuesses);
        setCurrentGuess("");

        if (currentGuess === solutionWord) {
          setGameStatus("WON");
        } else if (nextGuesses.length >= MAX_GUESSES) {
          setGameStatus("LOST");
        }
        return;
      }

      if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [currentGuess, gameStatus, pastGuesses, solutionWord]
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === "Enter" || event.key === "Backspace" || /^[a-zA-Z]$/.test(event.key)) {
        handleKeyPress(event.key);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKeyPress]);

  const handleRestart = () => {
    setSolutionWord(getRandomWord());
    setCurrentGuess("");
    setPastGuesses([]);
    setGameStatus("IN_PROGRESS");
    setBannerMessage("");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Wordle Clone</h1>
      </header>

      {bannerMessage && (
        <div className="message-banner" role="status">
          {bannerMessage}
        </div>
      )}

      <GameBoard
        pastGuesses={pastGuesses}
        currentGuess={currentGuess}
        solutionWord={solutionWord}
        gameStatus={gameStatus}
      />

      <Keyboard
        onKeyPress={handleKeyPress}
        keyStatuses={keyStatuses}
        disabled={gameStatus !== "IN_PROGRESS"}
      />

      {gameStatus !== "IN_PROGRESS" && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h2>{gameStatus === "WON" ? "You Won!" : "Game Over"}</h2>
            <p>
              {gameStatus === "WON"
                ? `Solved in ${pastGuesses.length} ${
                    pastGuesses.length === 1 ? "try" : "tries"
                  }.`
                : `The target word was ${solutionWord}.`}
            </p>
            <button type="button" className="restart-btn" onClick={handleRestart}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;