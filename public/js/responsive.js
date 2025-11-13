import { runAuthSubmit, runPwToggle, runChangeActionButton, runSubmitCommand, runStopCommand } from "./run.js";
import { makePretty, undoPretty } from "./util/make-pretty.js";

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
  if (clickType === "submit-command") await runSubmitCommand();
  if (clickType === "stop-command") await runStopCommand();

  if (clickType === "pwToggle") await runPwToggle();
  if (clickType === "action-button") await runChangeActionButton(clickElement);
  if (clickType === "make-pretty") await makePretty();
  if (clickType === "undo-pretty") await undoPretty();
};

export const keyHandler = async (e) => {
  if (e.key !== "Enter") return null;
  e.preventDefault();

  const keyElement = e.target;
  const keyId = keyElement.id;

  console.log("KEY HANDLER");
  console.log(keyElement);
  console.log(keyId);

  if (keyId === "auth-pw-input") await runAuthSubmit();

  if (!displayElement) return null;
  await runSubmitCommand();

  return true;
};

const displayElement = document.getElementById("display-element");
const authElement = document.getElementById("auth-element");

if (authElement) {
  authElement.addEventListener("click", clickHandler);
  authElement.addEventListener("keydown", keyHandler);
}

if (displayElement) {
  displayElement.addEventListener("click", clickHandler);
  displayElement.addEventListener("keydown", keyHandler);
}
