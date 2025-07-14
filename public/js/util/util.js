export const hideArrayFunction = (inputs) => {
  for (const input of inputs) {
    input.classList.add("hidden");
  }
};

//UNHIDE ARRAY
export const unhideArrayFunction = (inputs) => {
  for (const input of inputs) {
    input.classList.remove("hidden");
  }
};

//Make Pretty
export const makePretty = () => {
  const currentDataFormat = d.dataReturnUpdatesElement.innerHTML;

  //makePretty (reformat data)
  d.dataReturnUpdatesElement.innerHTML = "<pre>" + JSON.stringify(JSON.parse(currentDataFormat), null, 2) + "</pre>";

  //display Undo button
  d.undoButtonElement.style.display = "block";
};

//Undo Pretty
export const undoPretty = () => {
  const currentDataFormat = d.dataReturnUpdatesElement.innerHTML;
  //removes the <pre> from begin / end; checks if it's there first
  if (currentDataFormat.substring(0, 5) === "<pre>") {
    const removeBeginEnd = currentDataFormat.substring(5, currentDataFormat.length - 6);
    d.dataReturnUpdatesElement.innerHTML = removeBeginEnd;
  }
};
