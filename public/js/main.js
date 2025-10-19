// import state from "./util/state.js";
import { buildActionButtons } from "./display/action-buttons.js";
import { buildMainForm } from "./display/main-form.js";

//get display element
const displayElement = document.getElementById("display-element");

//DEFAULT DISPLAY
export const buildDisplay = async () => {
  if (!displayElement) return null;

  const inputWrapper = document.createElement("div");
  inputWrapper.id = "input-wrapper";

  const actionButtonElement = await buildActionButtons();
  const mainFormElement = await buildMainForm();
  if (!actionButtonElement || !mainFormElement) return null;

  inputWrapper.append(actionButtonElement, mainFormElement);

  displayElement.append(inputWrapper);
};

buildDisplay();
