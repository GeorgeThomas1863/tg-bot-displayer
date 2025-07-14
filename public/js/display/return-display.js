const returnElement = document.getElementById("return-element");

export const buildReturnDisplay = async (data) => {
  if (!data || !returnElement) return null;

  //build make pretty buttons
  const makePrettyButtons = await buildMakePrettyButtons();

  const parsedData = document.createElement("div");
  parsedData.id = "parsed-data";
  parsedData.innerHTML = JSON.stringify(data);

  //first load
  if (returnElement.children.length === 0) {
    returnElement.append(makePrettyButtons, parsedData);
    return true;
  }

  //check make pretty buttons (since only built once)
  const makePrettyButton = document.getElementById("make-pretty-button");
  const undoPrettyButton = document.getElementById("undo-pretty-button");
  if (makePrettyButton.classList.contains("hidden")) {
    makePrettyButton.classList.remove("hidden");
    undoPrettyButton.classList.add("hidden");
  }

  //replace old data
  returnElement.replaceChild(parsedData, returnElement.children[1]);
  return true;
};

export const buildMakePrettyButtons = async () => {
  if (!returnElement) return null;

  const buttonWrapper = document.createElement("div");
  buttonWrapper.id = "button-wrapper";

  const makePrettyButton = document.createElement("button");
  makePrettyButton.id = "make-pretty-button";
  makePrettyButton.textContent = "Make Pretty";

  const undoPrettyButton = document.createElement("button");
  undoPrettyButton.id = "undo-pretty-button";
  undoPrettyButton.textContent = "Undo Pretty";
  undoPrettyButton.classList.add("hidden");

  buttonWrapper.append(makePrettyButton, undoPrettyButton);

  return buttonWrapper;
};
