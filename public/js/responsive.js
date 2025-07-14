import { changeActionButtonDisplay, changeFormTitle } from "./display/change-display.js";
import { sendToBack } from "./util/api-front.js";
import { buildInputParams } from "./util/params.js";
// import { checkClickTrigger } from "./util/check-things.js";

const displayElement = document.getElementById("display-element");

export const mainClickHandler = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  // console.log("!!!CLICK ELEMENT");
  // console.log(clickElement);

  //action buttons
  if (clickElement.classList.contains("action-button")) {
    await changeActionButtonDisplay(clickElement);
    await changeFormTitle();
    return true;
  }

  //submit button
  if (clickElement.id !== "submit-button") return null;

  const inputParams = await buildInputParams();

  const data = await sendToBack(inputParams);
  console.log("!!!INPUT PARAMS");
  console.dir(inputParams);
};

if (displayElement) {
  displayElement.addEventListener("click", mainClickHandler);
}
