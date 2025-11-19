// import { setInputParamDefaults } from "./util/defaults.js";
import { tgGetUpdates, tgSendMessage, tgForwardMessage, tgEditMessageCaption } from "./tg-api.js";
import { runForwardAllStore } from "./forward-all/forward-all-store.js";
import { runCaptionAllLookup } from "./caption-all/caption-all-lookup.js";
import { runUploadPics } from "./upload-pics/upload-pics.js";
import CONFIG from "../config/config.js";
import state from "./util/state.js";

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
  const { defaultObject } = CONFIG;
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
