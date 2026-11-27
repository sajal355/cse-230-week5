function buildTileClassList(charValue, tileState) {
  const classes = ["tile"];
  if (charValue.trim().length > 0) {
    classes.push("filled");
  }
  if (tileState) {
    classes.push(tileState);
  }
  return classes.join(" ");
}

function Tile({ letter = "", status = "" }) {
  const displayChar = letter || "";
  const tileClasses = buildTileClassList(displayChar, status);
  const accessibleName = displayChar ? displayChar : "empty";

  return (
    <div className={tileClasses} aria-label={accessibleName}>
      {displayChar}
    </div>
  );
}

export default Tile;