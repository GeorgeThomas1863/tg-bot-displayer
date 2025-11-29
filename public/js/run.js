import { EYE_CLOSED_SVG, EYE_OPEN_SVG } from "./util/define-things.js";
import { actionButtonMap, listItemsButtonsArray, commandMap } from "./util/define-things.js";
import { getAuthParams, buildInputParams } from "./util/params-front.js";
import { sendToBack } from "./util/api-front.js";
import { buildReturnDisplay } from "./display/return-display.js";
import { undoPretty } from "./util/make-pretty.js";

import { hideArray, unhideArray } from "./util/collapse.js";

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

export const runSubmitCommand = async () => {
  const params = await buildInputParams();
  console.log("!!!SUBMIT COMMAND");
  console.log(params);

  const data = await sendToBack(params);
  if (!data) return null;
  console.log("!!!DATA");
  console.log(data);

  //reset make pretty button
  await undoPretty();

  await buildReturnDisplay(data);
  return true;
};

export const runStopCommand = async () => {
  const data = await sendToBack({ route: "/tg-submit-route", command: "stop" });
  console.log("!!!DATA");
  console.log(data);
  await buildReturnDisplay(data);
  return true;
};

export const runPwToggle = async () => {
  const pwButton = document.querySelector(".password-toggle-btn");
  const pwInput = document.querySelector(".password-input");

  // console.log(pwButton);
  // console.log(pwInput);
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

  const commandButton = document.getElementById("command-input");
  commandButton.value = commandMap[clickId];

  await hideArray(listItemsButtonsArray);
  await unhideArray(actionButtonMap[actionType]);

  if (commandButton.value === "getUpdates") await runSubmitCommand();

  return true;
};
