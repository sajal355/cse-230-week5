function Tile({ letter = "", status = "" }) {
  const classNames = ["tile"];
  if (letter) classNames.push("filled");
  if (status) classNames.push(status);

  return (
    <div className={classNames.join(" ")} aria-label={letter || "empty"}>
      {letter}
    </div>
  );
}

export default Tile;