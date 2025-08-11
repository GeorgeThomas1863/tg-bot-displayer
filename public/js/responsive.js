import { changeActionButtonDisplay, changeFormTitle, changePrettyDisplay } from "./display/change-display.js";
import { buildReturnDisplay } from "./display/return-display.js";
import { sendToBack } from "./util/api-front.js";
import { buildInputParams } from "./util/params-front.js";
// import { checkClickTrigger } from "./util/check-things.js";

const displayElement = document.getElementById("display-element");
const returnElement = document.getElementById("return-element");
// const getUpdatesActionButton = document.getElementById("get-updates-action-button");

export const displayClickHandler = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  console.log("!!!CLICK ELEMENT");
  console.log(clickElement);
  console.log(clickElement.id);

  //action buttons
  if (clickElement.classList.contains("action-button")) {
    await changeActionButtonDisplay(clickElement);
    await changeFormTitle();

    if (clickElement.id !== "get-updates-action-button") return true;
  }

  //submit button
  if (clickElement.id !== "submit-button" && clickElement.id !== "get-updates-action-button") return null;

  //get input params
  const inputParams = await buildInputParams();

  console.log("!!!INPUT PARAMS");
  console.log(inputParams);

  //send to back
  const data = await sendToBack(inputParams);
  if (!data) return null;

  //display return
  await buildReturnDisplay(data);
};

export const returnClickHandler = async (e) => {
  e.preventDefault();
  const clickElement = e.target;
  console.log("!!!CLICK ELEMENT");
  console.log(clickElement);

  if (clickElement.id !== "make-pretty-button" && clickElement.id !== "undo-pretty-button") return null;

  await changePrettyDisplay(clickElement);
};

if (displayElement) {
  displayElement.addEventListener("click", displayClickHandler);
  // getUpdatesActionButton.addEventListener("click", displayClickHandler);
}

if (returnElement) {
  returnElement.addEventListener("click", returnClickHandler);
}
