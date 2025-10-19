import d from "./util/define-things.js";
import { EYE_CLOSED_SVG, EYE_OPEN_SVG } from "./util/define-things.js";
import { getAuthParams } from "./util/params-front.js";
import { sendToBack } from "./util/api-front.js";
import { listItemsButtonsArray, commandMap, titleMap } from "./util/define-things.js";
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

// export const changeActionButtonDisplay = async (clickElement) => {
//   if (!clickElement) return null;

//   //SET COMMAND TYPE using the map
//   const commandType = commandMap[clickElement.id];
//   if (!commandType) return null;
//   d.commandInputElement.value = commandType;

//   //hide everything
//   await hideArray(listItemsButtonsArray);

//   switch (clickElement.id) {
//     case "get-updates-action-button":
//       await unhideArray([d.updateIdListItem]);
//       return true;

//     case "send-message-action-button":
//       await unhideArray([d.chatIdListItem, d.textInputListItem]);
//       return true;

//     case "forward-message-action-button":
//       await unhideArray([d.messageIdListItem, d.forwardFromListItem, d.forwardToListItem]);
//       return true;

//     case "forward-all-store-action-button":
//       await unhideArray([d.messageStartListItem, d.messageStopListItem, d.forwardFromListItem, d.forwardToListItem, d.forwardAllStoreTypeListItem, d.collectionSaveToListItem, d.dataTypeListItem]);
//       d.collectionSaveToListItem.value = "";
//       return true;

//     case "edit-caption-action-button":
//       await unhideArray([d.messageIdListItem, d.editCaptionChannelListItem, d.textInputListItem]);
//       d.commandListItem.value = "editMessageCaption";
//       return true;

//     case "caption-all-lookup-action-button":
//       await unhideArray([
//         d.messageStartListItem,
//         d.messageStopListItem,
//         d.collectionPullFromListItem,
//         d.collectionSaveToListItem,
//         d.captionLookupTypeListItem,
//         d.editCaptionChannelListItem,
//         d.forwardToListItem,
//         d.dataTypeListItem,
//       ]);
//       d.collectionPullFromElement.value = "";
//       d.collectionSaveToListItem.value = "";
//       return true;

//     case "upload-pics-action-button":
//       await unhideArray([d.uploadToListItem, d.uploadPicTypeListItem, d.picPathListItem, d.collectionPullFromListItem, d.collectionSaveToListItem]);
//       d.collectionPullFromElement.value = "";
//       d.collectionSaveToElement.value = "";
//       return true;
//   }

//   return null;
// };

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
