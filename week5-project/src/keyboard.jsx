const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

function Keyboard({ onKeyPress, keyStatuses = {}, disabled = false }) {
  return (
    <section className="keyboard" aria-label="On-screen keyboard">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const isSpecial = key === "ENTER" || key === "BACKSPACE";
            const status = !isSpecial ? keyStatuses[key] || "" : "";
            const classes = ["key"];
            if (isSpecial) classes.push("key-wide");
            if (status) classes.push(status);

            return (
              <button
                key={key}
                type="button"
                className={classes.join(" ")}
                disabled={disabled}
                onClick={() => onKeyPress(key)}
                aria-label={key === "BACKSPACE" ? "Backspace" : key}
              >
                {key === "BACKSPACE" ? "⌫" : key}
              </button>
            );
          })}
        </div>
      ))}
    </section>
  );
}

export default Keyboard;