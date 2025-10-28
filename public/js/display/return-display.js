const displayElement = document.getElementById("display-element");

export const buildReturnDisplay = async (data) => {
  if (!data || !displayElement) return null;

  const returnWrapper = document.createElement("div");
  returnWrapper.id = "return-wrapper";

  //build make pretty buttons
  const makePrettyButtons = await buildMakePrettyButtons();
  returnWrapper.append(makePrettyButtons);

  const currentData = document.getElementById("parse-wrapper");
  if (currentData) currentData.remove();

  const parseData = await buildParseData(data);
  returnWrapper.append(parseData);

  displayElement.append(returnWrapper);
};

export const buildParseData = async (data) => {
  if (!data) return null;

  const parseWrapper = document.createElement("div");
  parseWrapper.id = "parse-wrapper";

  const parsedData = document.createElement("div");
  parsedData.id = "parsed-data";
  parsedData.innerHTML = JSON.stringify(data);
  parseWrapper.append(parsedData);

  return parseWrapper;
};

export const buildMakePrettyButtons = async () => {
  //check if already built
  const checkButton = document.getElementById("button-wrapper");
  if (checkButton) return checkButton;

  const buttonWrapper = document.createElement("div");
  buttonWrapper.id = "button-wrapper";

  const makePrettyButton = document.createElement("button");
  makePrettyButton.id = "make-pretty-button";
  makePrettyButton.textContent = "Make Pretty";
  makePrettyButton.setAttribute("data-label", "make-pretty");

  const undoPrettyButton = document.createElement("button");
  undoPrettyButton.id = "undo-pretty-button";
  undoPrettyButton.textContent = "Undo Pretty";
  undoPrettyButton.setAttribute("data-label", "undo-pretty");
  undoPrettyButton.classList.add("hidden");

  buttonWrapper.append(makePrettyButton, undoPrettyButton);

  return buttonWrapper;
};
