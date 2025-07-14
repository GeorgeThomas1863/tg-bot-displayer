import { changeActionButtonDisplay } from "../display/change-display.js";

export const checkClickTrigger = async (clickElement) => {
  if (!clickElement) return null;

  //just checks for action button
  if (!clickElement.classList.contains("action-button")) return null;

  const data = await changeActionButtonDisplay(clickElement);
  return data;
};
