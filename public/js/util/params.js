import { d } from "./define-things.js";

//BUILD INPUT PARAMS
export const buildInputParams = async () => {
  //reset each time
  const params = {
    messageStart: +d.messageStartElement.value,
    messageStop: +d.messageStopElement.value,
    forwardFromId: d.forwardFromElement.value,
    forwardToId: d.forwardToElement.value,
    uploadToId: d.uploadToElement.value,
    editChannelId: d.editCaptionsChannelElement.value,
    collectionPullFrom: d.collectionPullFromElement.value,
    collectionSaveTo: d.collectionSaveToElement.value,
    picPath: d.picPathElement.value,
    chatId: d.chatIdElement.value,
    messageId: d.messageIdElement.value,
    text: d.textInputElement.value,
    caption: d.textInputElement.value,
    offset: d.updateIdElement.value,
    commandType: d.commandInputElement.value,
    uploadPicType: d.uploadPicTypeInput.value,
    forwardAllType: d.forwardAllStoreType.value,
    captionAllType: d.captionLookupTypeInput.value,
    tokenIndex: 0,
    alreadyStoredArray: [],
    route: "/tg-submit-route",
  };

  return params;
};
