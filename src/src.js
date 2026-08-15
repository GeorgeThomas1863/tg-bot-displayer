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

  const submittedCaption = inputParams.caption;
  const submittedText = inputParams.text;

  // add defaults
  const params = await addDefaultParams(inputParams);
  coerceRangeBounds(params);
  const { command, offset } = params;

  if (command === "editMessageCaption") {
    params.caption = getCaption(submittedCaption, submittedText);
  }

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

const getCaption = (caption, text) => {
  if (typeof caption === "string" && caption !== "") return caption;
  if (typeof text === "string" && text !== "") return text;
  return process.env.CAPTION;
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

// Coerce range bounds to numbers so range loops (e.g. `for (let i = messageStart; i < messageStop; i++)`)
// compare numerically instead of lexicographically ("9" < "10" is false as strings).
// Throws on non-numeric input — a NaN bound would make the range loops silently no-op.
// Only the range commands are checked: the browser submits messageStart/messageStop
// for every command, so validating them globally would break commands that never use them.
// Mutates params in place; returns nothing.
const rangeCommands = ["forwardAllStore", "captionAllLookup"];

const coerceRangeBounds = (params) => {
  if (!params) return;
  if (!rangeCommands.includes(params.command)) return;

  const rangeKeys = ["messageStart", "messageStop"];
  for (let i = 0; i < rangeKeys.length; i++) {
    const key = rangeKeys[i];
    const value = params[key];
    if (value === undefined || value === null || value === "") continue;

    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) throw new Error(`Invalid ${key}: "${value}" is not a number`);
    params[key] = numberValue;
  }
};
