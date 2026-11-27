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

const ACTIVE_STATE = "IN_PROGRESS";
const WIN_STATE = "WON";
const LOSS_STATE = "LOST";

function App() {
  const [targetWord, setTargetWord] = useState(() => getRandomWord());
  const [activeInput, setActiveInput] = useState("");
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [roundStatus, setRoundStatus] = useState(ACTIVE_STATE);
  const [alertText, setAlertText] = useState("");

  const letterMap = useMemo(
    () => getKeyboardStatuses(attemptHistory, targetWord),
    [attemptHistory, targetWord]
  );

  const submitCurrentAttempt = useCallback(() => {
    if (activeInput.length < WORD_LENGTH) {
      setAlertText(`Type all ${WORD_LENGTH} letters before pressing Enter.`);
      return;
    }

    const updatedHistory = [...attemptHistory, activeInput];
    setAttemptHistory(updatedHistory);
    setActiveInput("");

    if (activeInput === targetWord) {
      setRoundStatus(WIN_STATE);
    } else if (updatedHistory.length >= MAX_GUESSES) {
      setRoundStatus(LOSS_STATE);
    }
  }, [activeInput, attemptHistory, targetWord]);

  const processKeyInput = useCallback(
    (rawInput) => {
      if (roundStatus !== ACTIVE_STATE) return;

      const normalizedKey = rawInput.toUpperCase();
      setAlertText("");

      if (normalizedKey === "BACKSPACE" || normalizedKey === "DELETE") {
        setActiveInput((prevText) => prevText.slice(0, -1));
        return;
      }

      if (normalizedKey === "ENTER") {
        submitCurrentAttempt();
        return;
      }

      const isSingleLetter = /^[A-Z]$/.test(normalizedKey);
      if (isSingleLetter && activeInput.length < WORD_LENGTH) {
        setActiveInput((prevText) => `${prevText}${normalizedKey}`);
      }
    },
    [activeInput.length, roundStatus, submitCurrentAttempt]
  );

  useEffect(() => {
    const handlePhysicalKey = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const pressed = event.key;
      const validKey =
        pressed === "Enter" ||
        pressed === "Backspace" ||
        /^[a-zA-Z]$/.test(pressed);

      if (validKey) {
        processKeyInput(pressed);
      }
    };

    window.addEventListener("keydown", handlePhysicalKey);
    return () => window.removeEventListener("keydown", handlePhysicalKey);
  }, [processKeyInput]);

  const startNewRound = () => {
    setTargetWord(getRandomWord());
    setActiveInput("");
    setAttemptHistory([]);
    setRoundStatus(ACTIVE_STATE);
    setAlertText("");
  };

  const isGameOver = roundStatus !== ACTIVE_STATE;
  const attemptsCount = attemptHistory.length;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Wordle Clone</h1>
      </header>

      {alertText && (
        <div className="message-banner" role="status">
          {alertText}
        </div>
      )}

      <GameBoard
        pastGuesses={attemptHistory}
        currentGuess={activeInput}
        solutionWord={targetWord}
        gameStatus={roundStatus}
      />

      <Keyboard
        onKeyPress={processKeyInput}
        keyStatuses={letterMap}
        disabled={isGameOver}
      />

      {isGameOver && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h2>{roundStatus === WIN_STATE ? "You Won!" : "Game Over"}</h2>
            <p>
              {roundStatus === WIN_STATE
                ? `You solved it in ${attemptsCount} ${
                    attemptsCount === 1 ? "guess" : "guesses"
                  }.`
                : `The hidden word was ${targetWord}.`}
            </p>
            <button type="button" className="restart-btn" onClick={startNewRound}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;