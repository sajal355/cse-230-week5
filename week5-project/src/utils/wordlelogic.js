export const WORD_LIST = [
  "APPLE", "BRAVE", "CRANE", "DRIFT", "EAGLE",
  "CRISP", "FROST", "GLINT", "HAVEN", "JUMBO",
  "KNEEL", "LUNAR", "MIRTH", "NOBLE", "ORBIT",
  "PLUMB", "QUILT", "ROAST", "SHELF", "TREND",
  "ULCER", "VAULT", "WOVEN", "XERIC", "YIELD",
  "ZESTY", "BLAZE", "CHORD", "DWELL", "SOLAR"
];

export const MAX_GUESSES = 6;
export const WORD_LENGTH = 5;

export function getRandomWord() {
  const randomIdx = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[randomIdx];
}

export function evaluateGuess(guess, solution) {
  const guessUpper = guess.toUpperCase();
  const solutionUpper = solution.toUpperCase();
  const outcome = Array(WORD_LENGTH).fill("absent");
  const poolCounts = {};

  // First pass: mark exact slot matches
  for (let idx = 0; idx < WORD_LENGTH; idx++) {
    const targetChar = solutionUpper[idx];
    if (guessUpper[idx] === targetChar) {
      outcome[idx] = "correct";
    } else {
      poolCounts[targetChar] = (poolCounts[targetChar] || 0) + 1;
    }
  }

  // Second pass: mark right letter in a different slot
  for (let idx = 0; idx < WORD_LENGTH; idx++) {
    if (outcome[idx] === "correct") continue;
    const ch = guessUpper[idx];
    if (poolCounts[ch] > 0) {
      outcome[idx] = "present";
      poolCounts[ch] -= 1;
    }
  }

  return outcome;
}

const STATUS_PRIORITY = {
  correct: 3,
  present: 2,
  absent: 1,
};

export function getKeyboardStatuses(pastGuesses, solution) {
  const statusByKey = {};

  for (const attempt of pastGuesses) {
    const rowScores = evaluateGuess(attempt, solution);
    for (let idx = 0; idx < attempt.length; idx++) {
      const ch = attempt[idx].toUpperCase();
      const candidate = rowScores[idx];
      const current = statusByKey[ch];

      if (!current || STATUS_PRIORITY[candidate] > STATUS_PRIORITY[current]) {
        statusByKey[ch] = candidate;
      }
    }
  }

  return statusByKey;
}