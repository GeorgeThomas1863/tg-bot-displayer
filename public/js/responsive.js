import { runAuthSubmit, runPwToggle } from "./run.js";
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

  switch (clickType) {
    case "auth-submit":
      await runAuthSubmit();
      break;

    case "pwToggle":
      await runPwToggle();
      break;

    default:
      break;
  }

  //action buttons
  // if (clickElement.classList.contains("action-button")) {
  //   await changeActionButtonDisplay(clickElement);
  //   await changeFormTitle();

  //   if (clickElement.id !== "get-updates-action-button") return true;
  // }

  // //submit button
  // if (clickElement.id !== "submit-button" && clickElement.id !== "get-updates-action-button") return null;

  // //get input params
  // const inputParams = await buildInputParams();

  // console.log("!!!INPUT PARAMS");
  // console.log(inputParams);

  // //send to back
  // const data = await sendToBack(inputParams);
  // if (!data) return null;

  // //display return
  // await buildReturnDisplay(data);
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
