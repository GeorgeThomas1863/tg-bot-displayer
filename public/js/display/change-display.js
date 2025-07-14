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
      await unhideArray([d.updateIdListItem]);
      d.commandListItem.value = "getUpdates";
      return true;

    case "send-message-action-button":
      await unhideArray([d.chatIdListItem, d.textInputListItem]);
      d.commandListItem.value = "sendMessage";
      return true;

    case "forward-message-action-button":
      await unhideArray([d.messageIdListItem, d.forwardFromListItem, d.forwardToListItem]);
      d.commandListItem.value = "forwardMessage";
      return true;

    case "forward-all-store-action-button":
      await unhideArray([d.messageStartListItem, d.messageStopListItem, d.forwardFromListItem, d.forwardToListItem, d.forwardAllStoreTypeListItem, d.collectionSaveToListItem]);
      d.commandInputElement.value = "forwardAllStore";
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
      ]);
      d.commandInputElement.value = "captionAllLookup";
      d.collectionPullFromElement.value = "";
      d.collectionSaveToListItem.value = "";
      return true;

    case "upload-pics-action-button":
      await unhideArray([d.uploadToListItem, d.uploadPicTypeListItem, d.picPathListItem, d.collectionPullFromListItem, d.collectionSaveToListItem]);
      d.commandListItem.value = "sendPhoto";
      d.collectionPullFromElement.value = "";
      d.collectionSaveToElement.value = "";
      return true;
  }

  return null;
};
