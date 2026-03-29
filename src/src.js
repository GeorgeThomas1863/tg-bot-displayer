// import { setInputParamDefaults } from "./util/defaults.js";
import { tgGetUpdates, tgSendMessage, tgForwardMessage, tgEditMessageCaption } from "./tg-api.js";
import { runForwardAllStore } from "./forward-all/forward-all-store.js";
import { runCaptionAllLookup } from "./caption-all/caption-all-lookup.js";
import { runUploadPics } from "./upload-pics/upload-pics.js";

import state from "./util/state.js";

//define default object
const defaultObject = {
  messageStart: process.env.MESSAGE_START,
  messageStop: process.env.MESSAGE_STOP,
  forwardFromId: process.env.FORWARD_FROM_ID, //random stuff
  forwardToId: process.env.FORWARD_TO_ID, //forwardTest21
  uploadToId: process.env.UPLOAD_TO_ID,
  editChannelId: process.env.EDIT_CHANNEL_ID, //editCaptionsTest11
  collectionPullFrom: process.env.COLLECTION_PULL_FROM,
  collectionExtra: process.env.COLLECTION_EXTRA,
  collectionSaveTo: process.env.COLLECTION_SAVE_TO,
  picPath: process.env.PIC_PATH,
  chatId: process.env.CHAT_ID,
  messageId: process.env.MESSAGE_ID,
  text: process.env.TEXT,
  caption: process.env.CAPTION,
  dataType: process.env.DATA_TYPE,
};

export const tgCommandRun = async (inputParams) => {
  if (!inputParams || !state.active || !inputParams.command) return null;

  // add defaults
  const params = await addDefaultParams(inputParams);
  const { command, offset } = params;

  console.log("INPUT PARAMS PARSE");
  console.log(params);

  if (command === "getUpdates") return await tgGetUpdates({ offset: offset });
  if (command === "sendMessage") return await tgSendMessage(params);
  if (command === "forwardMessage") return await tgForwardMessage(params);
  if (command === "editMessageCaption") return await tgEditMessageCaption(params);
  if (command === "forwardAllStore") return await runForwardAllStore(params);
  if (command === "captionAllLookup") return await runCaptionAllLookup(params);
  if (command === "sendPhoto") return await runUploadPics(params);

  return null;
};

//Set defaults
const addDefaultParams = async (inputParams) => {
  if (!inputParams || !defaultObject) return inputParams;
  //DEFAULTS

  for (let key1 in inputParams) {
    if (inputParams[key1] !== "" && inputParams[key1] !== 0) {
      continue;
    }

    for (let key2 in defaultObject) {
      if (key2 === key1) {
        inputParams[key1] = defaultObject[key2];
      }
    }
  }
  return inputParams;
};
