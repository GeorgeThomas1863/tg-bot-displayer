export const makePretty = async () => {
  const parsedData = document.getElementById("parsed-data");
  if (!parsedData) return null;

  //change display
  const currentFormat = parsedData.innerHTML;
  const prettyFormat = "<pre>" + JSON.stringify(JSON.parse(currentFormat), null, 2) + "</pre>";
  parsedData.innerHTML = prettyFormat;

  const makePrettyButton = document.getElementById("make-pretty-button");
  const undoPrettyButton = document.getElementById("undo-pretty-button");

  makePrettyButton.classList.add("hidden");
  undoPrettyButton.classList.remove("hidden");
  return true;
};

//Undo Pretty
export const undoPretty = async () => {
  const parsedData = document.getElementById("parsed-data");
  if (!parsedData) return null;

  const currentFormat = parsedData.innerHTML;
  //removes the <pre> from begin / end; checks if it's there first
  if (currentFormat.substring(0, 5) !== "<pre>") return null;

  const undoPrettyFormat = currentFormat.substring(5, currentFormat.length - 6);
  parsedData.innerHTML = undoPrettyFormat;

  const makePrettyButton = document.getElementById("make-pretty-button");
  const undoPrettyButton = document.getElementById("undo-pretty-button");

  makePrettyButton.classList.remove("hidden");
  undoPrettyButton.classList.add("hidden");
  return true;
};
