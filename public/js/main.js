// import state from "./util/state.js";
import { buildActionButtons } from "./display/action-buttons.js";
import { buildMainForm } from "./display/main-form.js";

//get display element
const displayElement = document.getElementById("display-element");

//DEFAULT DISPLAY
export const buildDisplay = async () => {
  if (!displayElement) return null;

  const actionButtonElement = await buildActionButtons();
  const mainFormElement = await buildMainForm();

  displayElement.append(actionButtonElement, mainFormElement);
};

buildDisplay();
