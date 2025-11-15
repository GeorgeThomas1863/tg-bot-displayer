// import { setInputParamDefaults } from "./util/defaults.js";
import { tgGetUpdates, tgSendMessage, tgForwardMessage, tgEditMessageCaption } from "./util/tg-api.js";
import { runForwardAllStore } from "./forward-all/forward-all-store.js";
import { runCaptionAllLookup } from "./caption-all/caption-all-lookup.js";
import { runUploadPics } from "./upload-pics/upload-pics.js";
import state from "./util/state.js";

export const tgCommandRun = async (inputParams) => {
  if (!inputParams || !state.active || !inputParams.command) return null;
  console.log("!!!INPUT PARAMS RAW");
  console.log(inputParams);

  // add defaults
  const params = await setInputParamDefaults(inputParams);
  const { command, offset } = params;

  // console.log("PARAMS");
  // console.log(params);

  if (command === "getUpdates") return await tgGetUpdates({ offset: offset });
  if (command === "sendMessage") return await tgSendMessage(params);
  if (command === "forwardMessage") return await tgForwardMessage(params);
  if (command === "editMessageCaption") return await tgEditMessageCaption(params);
  if (command === "forwardAllStore") return await runForwardAllStore(params);
  if (command === "captionAllLookup") return await runCaptionAllLookup(params);
  if (command === "sendPhoto") return await runUploadPics(params);

  return null;
};

//Set to default
export const setInputParamDefaults = async (inputParams) => {
  const paramsDefaultAdded = await addDefaultParams(inputParams);
  const finishedParams = await addCallParams(paramsDefaultAdded);

  return finishedParams;
};

const addDefaultParams = async (inputParams) => {
  //DEFAULTS
  const defaultObject = {
    messageStart: 0,
    messageStop: 20,
    forwardFromId: -1002123668375, //random stuff
    forwardToId: -1002468318224, //forwardTest53
    uploadToId: -1002468318224,
    editChannelId: -1002230354437,
    collectionPullFrom: "balls1",
    collectionSaveTo: "balls2",
    picPath: "G:/PICS/",
    //picPath: "/home/george/code/pics/",
    chatId: 552805041,
    messageId: 1,
    text: "bundle of sticks",
    caption: "",
    offset: "",
    dataType: "kink",
  };

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

const addCallParams = async (inputParams) => {
  const methodObject = {
    // 1: "tgGet",
    // 2: "tgPost",
    // 3: "tgPost",
    // 4: "tgPost",
    5: "forwardLoop",
    6: "captionLoop",
    7: "picLoop",
  };

  for (let key in methodObject) {
    if (+key === +inputParams.commandId) {
      inputParams.call = methodObject[key];
    }
  }

  return inputParams;
};
