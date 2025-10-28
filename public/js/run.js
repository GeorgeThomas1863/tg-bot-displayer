import d from "./util/define-things.js";
import { EYE_CLOSED_SVG, EYE_OPEN_SVG } from "./util/define-things.js";
import { actionButtonMap, listItemsButtonsArray, commandMap, titleMap } from "./util/define-things.js";
import { getAuthParams, buildInputParams } from "./util/params-front.js";
import { sendToBack } from "./util/api-front.js";

import { hideArray, unhideArray } from "./util/collapse.js";
import { makePretty, undoPretty } from "./util/make-pretty.js";

export const runAuthSubmit = async () => {
  try {
    const authParams = await getAuthParams();
    authParams.route = "/site-auth-route";
    const authData = await sendToBack(authParams);
    if (!authData || !authData.redirect) return null;

    window.location.href = authData.redirect;
    return authData;
  } catch (e) {
    console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
    return null;
  }
};

export const runPwToggle = async () => {
  const pwButton = document.querySelector(".password-toggle-btn");
  const pwInput = document.querySelector(".password-input");

  console.log(pwButton);
  console.log(pwInput);
  const currentSvgId = pwButton.querySelector("svg").id;

  if (currentSvgId === "eye-closed-icon") {
    pwButton.innerHTML = EYE_OPEN_SVG;
    pwInput.type = "text";
  } else {
    pwButton.innerHTML = EYE_CLOSED_SVG;
    pwInput.type = "password";
  }

  return true;
};

export const runChangeActionButton = async (clickElement) => {
  if (!clickElement) return null;

  const clickId = clickElement.id;
  const actionType = clickId.split("-").slice(0, -2).join("-");

  await hideArray(listItemsButtonsArray);
  await unhideArray(actionButtonMap[actionType]);

  return true;
};

export const runSubmitCommand = async () => {
  const params = await buildInputParams();
  console.log("!!!SUBMIT COMMAND");
  console.log(params);
  const data = await sendToBack(params);
  if (!data) return null;
  console.log("!!!DATA");
  console.log(data);
  return true;
};

export const runStopCommand = async () => {};

// export const changeFormTitle = async () => {
//   const commandInputElement = document.getElementById("command-input");
//   const titleElement = document.querySelector(".collapse-header");
//   const titleText = titleMap[commandInputElement?.value] || "TELEGRAM INPUT";
//   titleElement.textContent = titleText.toUpperCase();
//   return true;
// };

// export const changePrettyDisplay = async (clickElement) => {
//   if (!clickElement) return null;

//   switch (clickElement.id) {
//     case "make-pretty-button":
//       await makePretty();
//       return true;

//     case "undo-pretty-button":
//       await undoPretty();
//       return true;
//   }
// };
