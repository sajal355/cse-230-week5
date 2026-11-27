const KEY_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

const ACTION_KEYS = new Set(["ENTER", "BACKSPACE"]);

function buildKeyClassName(keyLabel, isActionKey, letterStatus) {
  const keyClasses = ["key"];
  if (isActionKey) {
    keyClasses.push("key-wide");
  }
  if (!isActionKey && letterStatus) {
    keyClasses.push(letterStatus);
  }
  return keyClasses.join(" ");
}

function Keyboard({ onKeyPress, keyStatuses = {}, disabled = false }) {
  return (
    <section className="keyboard" aria-label="On-screen keyboard">
      {KEY_LAYOUT.map((rowKeys, idx) => (
        <div key={idx} className="keyboard-row">
          {rowKeys.map((keyLabel) => {
            const isActionKey = ACTION_KEYS.has(keyLabel);
            const letterStatus = isActionKey ? "" : keyStatuses[keyLabel] || "";
            const buttonLabel = keyLabel === "BACKSPACE" ? "Backspace" : keyLabel;
            const visibleText = keyLabel === "BACKSPACE" ? "⌫" : keyLabel;

            return (
              <button
                key={keyLabel}
                type="button"
                className={buildKeyClassName(keyLabel, isActionKey, letterStatus)}
                disabled={disabled}
                onClick={() => onKeyPress(keyLabel)}
                aria-label={buttonLabel}
              >
                {visibleText}
              </button>
            );
          })}
        </div>
      ))}
    </section>
  );
}

export default Keyboard;