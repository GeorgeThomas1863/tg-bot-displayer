import d from "../util/define-things.js";
import { listItemsButtonsArray, commandMap, titleMap } from "../util/define-things.js";
import { hideArray, unhideArray, makePretty, undoPretty } from "../util/util.js";

export const changeActionButtonDisplay = async (clickElement) => {
  if (!clickElement) return null;

  //SET COMMAND TYPE using the map
  const commandType = commandMap[clickElement.id];
  if (!commandType) return null;
  d.commandInputElement.value = commandType;

  //hide everything
  await hideArray(listItemsButtonsArray);

  switch (clickElement.id) {
    case "get-updates-action-button":
      await unhideArray([d.updateIdListItem]);
      return true;

    case "send-message-action-button":
      await unhideArray([d.chatIdListItem, d.textInputListItem]);
      return true;

    case "forward-message-action-button":
      await unhideArray([d.messageIdListItem, d.forwardFromListItem, d.forwardToListItem]);
      return true;

    case "forward-all-store-action-button":
      await unhideArray([d.messageStartListItem, d.messageStopListItem, d.forwardFromListItem, d.forwardToListItem, d.forwardAllStoreTypeListItem, d.collectionSaveToListItem, d.dataTypeListItem]);
      d.collectionSaveToListItem.value = "";
      return true;

    case "edit-caption-action-button":
      await unhideArray([d.messageIdListItem, d.editCaptionChannelListItem, d.textInputListItem]);
      d.commandListItem.value = "editMessageCaption";
      return true;

    case "caption-all-lookup-action-button":
      await unhideArray([
        d.messageStartListItem,
        d.messageStopListItem,
        d.collectionPullFromListItem,
        d.collectionSaveToListItem,
        d.captionLookupTypeListItem,
        d.editCaptionChannelListItem,
        d.forwardToListItem,
        d.dataTypeListItem,
      ]);
      d.collectionPullFromElement.value = "";
      d.collectionSaveToListItem.value = "";
      return true;

    case "upload-pics-action-button":
      await unhideArray([d.uploadToListItem, d.uploadPicTypeListItem, d.picPathListItem, d.collectionPullFromListItem, d.collectionSaveToListItem]);
      d.collectionPullFromElement.value = "";
      d.collectionSaveToElement.value = "";
      return true;
  }

  return null;
};

export const changeFormTitle = async () => {
  const commandInputElement = document.getElementById("command-input");
  const titleElement = document.querySelector(".collapse-header");
  const titleText = titleMap[commandInputElement?.value] || "TELEGRAM INPUT";
  titleElement.textContent = titleText.toUpperCase();
  return true;
};

export const changePrettyDisplay = async (clickElement) => {
  if (!clickElement) return null;

  switch (clickElement.id) {
    case "make-pretty-button":
      await makePretty();
      return true;

    case "undo-pretty-button":
      await undoPretty();
      return true;
  }
};
