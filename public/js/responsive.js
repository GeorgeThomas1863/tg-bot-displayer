import { runAuthSubmit, runPwToggle, runChangeActionButton, runSubmitCommand, runStopCommand } from "./run.js";
import { makePretty, undoPretty } from "./util/make-pretty.js";
// import { changeActionButtonDisplay, changeFormTitle, changePrettyDisplay } from "./display/change-display.js";
// import { buildReturnDisplay } from "./display/return-display.js";
// import { sendToBack } from "./util/api-front.js";
// import { buildInputParams } from "./util/params-front.js";
// import { checkClickTrigger } from "./util/check-things.js";

export const clickHandler = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  const clickId = clickElement.id;
  const clickType = clickElement.getAttribute("data-label");

  console.log("!!!CLICK ELEMENT");
  console.log(clickElement);
  console.log("CLICK ID");
  console.log(clickId);
  console.log("CLICK TYPE");
  console.log(clickType);

  if (clickType === "auth-submit") await runAuthSubmit();
  if (clickType === "pwToggle") await runPwToggle();
  if (clickType === "action-button") await runChangeActionButton(clickElement);
  if (clickType === "submit-command") await runSubmitCommand();
  if (clickType === "stop-command") await runStopCommand();
  if (clickType === "make-pretty") await makePretty();
  if (clickType === "undo-pretty") await undoPretty();
};

// export const stopClickHandler = async (e) => {
//   e.preventDefault();
//   console.log("!!!STOP CLICKED");

//   const params = {
//     route: "/tg-submit-route",
//     command: "stop",
//   };

//   const data = await sendToBack(params);
//   if (!data) return null;

//   await buildReturnDisplay("DATA STOPPED");
// };

// export const returnClickHandler = async (e) => {
//   e.preventDefault();
//   const clickElement = e.target;
//   console.log("!!!CLICK ELEMENT");
//   console.log(clickElement);

//   if (clickElement.id !== "make-pretty-button" && clickElement.id !== "undo-pretty-button") return null;

//   await changePrettyDisplay(clickElement);
// };

const displayElement = document.getElementById("display-element");
const authElement = document.getElementById("auth-element");

if (authElement) {
  authElement.addEventListener("click", clickHandler);
}

if (displayElement) {
  displayElement.addEventListener("click", clickHandler);
  // getUpdatesActionButton.addEventListener("click", displayClickHandler);
}

// if (stopButton) {
//   stopButton.addEventListener("click", stopClickHandler);
// }

// if (returnElement) {
//   returnElement.addEventListener("click", returnClickHandler);
// }

// const returnElement = document.getElementById("return-element");
// const stopButton = document.getElementById("stop-button");
