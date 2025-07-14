const returnElement = document.getElementById("return-element");

export const buildReturnDisplay = async (data) => {
  if (!data || !returnElement) return null;

  //build make pretty buttons
  const makePrettyButtons = await buildMakePrettyButtons();

  const parsedData = document.createElement("div");
  parsedData.id = "parsed-data";
  parsedData.innerHTML = JSON.stringify(data);

  //FORMAT BETTER (maybe)
  returnElement.append(makePrettyButtons, parsedData);
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
