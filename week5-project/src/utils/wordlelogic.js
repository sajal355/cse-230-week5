export const WORD_LIST = [
  "APPLE", "BRAVE", "CRANE", "DRIFT", "EAGLE",
  "FLAME", "GRAPE", "HEART", "IVORY", "JOKER",
  "KNIFE", "LEMON", "MANGO", "NIGHT", "OLIVE",
  "PEARL", "QUEST", "RIVER", "STONE", "TIGER",
  "UNITY", "VIVID", "WHALE", "XENON", "YACHT",
  "ZEBRA"
];

export const MAX_GUESSES = 6;
export const WORD_LENGTH = 5;

export function getRandomWord() {
  const index = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[index];
}

/**
 * Evaluates a 5-letter guess against the target solution word.
 * Returns an array of statuses: 'correct' (green), 'present' (yellow), or 'absent' (gray).
 */
export function evaluateGuess(guess, solution) {
  const upperGuess = guess.toUpperCase();
  const upperSolution = solution.toUpperCase();
  const result = Array(WORD_LENGTH).fill("absent");
  const remainingCounts = {};

  // Pass 1: Mark exact positional matches ('correct') and count remaining letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    const solChar = upperSolution[i];
    if (upperGuess[i] === solChar) {
      result[i] = "correct";
    } else {
      remainingCounts[solChar] = (remainingCounts[solChar] || 0) + 1;
    }
  }

  // Pass 2: Mark misplaced letters ('present') if unused occurrences remain
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;
    const guessChar = upperGuess[i];
    if (remainingCounts[guessChar] > 0) {
      result[i] = "present";
      remainingCounts[guessChar] -= 1;
    }
  }

  return result;
}

const STATUS_PRIORITY = {
  correct: 3,
  present: 2,
  absent: 1,
};

/**
 * Builds a map of { [letter]: highestStatus } across all submitted guesses
 * so the virtual keyboard reflects the strongest feedback per letter.
 */
export function getKeyboardStatuses(pastGuesses, solution) {
  const keyMap = {};

  for (const guess of pastGuesses) {
    const evaluations = evaluateGuess(guess, solution);
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i].toUpperCase();
      const nextStatus = evaluations[i];
      const currentStatus = keyMap[letter];

      if (
        !currentStatus ||
        STATUS_PRIORITY[nextStatus] > STATUS_PRIORITY[currentStatus]
      ) {
        keyMap[letter] = nextStatus;
      }
    }
  }

  return keyMap;
}