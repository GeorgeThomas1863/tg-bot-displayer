import { d } from "./define-things.js";

// export const setCommandType = async (clickElement) => {
//   if (!clickElement) return null;
//   console.log("!!!SET COMMAND TYPE");
//   console.log(clickElement);
//   console.log(clickElement.id);

//   // d.commandType.value = clickElement.id;
//   // return true;
// };

//BUILD INPUT PARAMS
export const buildInputParams = async () => {
  //reset each time
  const params = {
    route: "/tg-submit-route",
    messageStart: +d.messageStartElement.value,
    messageStop: +d.messageStopElement.value,
    forwardFromId: +d.forwardFromElement.value,
    forwardToId: +d.forwardToElement.value,
    uploadToId: d.uploadToElement.value,
    editChannelId: d.editCaptionsChannelElement.value,
    collectionPullFrom: d.collectionPullFromElement.value,
    collectionSaveTo: d.collectionSaveToElement.value,
    dataType: d.dataTypeElement.value,
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
    alreadyStoredArray: [],
  };

  return params;
};
