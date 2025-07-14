import { d, listItemsButtonsArray } from "../util/define-things.js";
import { hideArray, unhideArray } from "../util/util.js";

export const changeActionButtonDisplay = async (clickElement) => {
  if (!clickElement) return null;

  console.log("!!!CHANGE ACTION BUTTON DISPLAY");
  console.log(clickElement.id);

  //hide everything
  await hideArray(listItemsButtonsArray);

  switch (clickElement.id) {
    case "get-updates-action-button":
      await unhideArray([d.updateIdListItem, d.commandListItem]);
      break;

    case "send-message-action-button":
      await unhideArray([d.chatIdListItem, d.textInputListItem, d.commandListItem]);
      break;

    case "forward-message-action-button":
  }

  return true;
};
