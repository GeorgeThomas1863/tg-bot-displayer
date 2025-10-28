import { setInputParamDefaults } from "./util/defaults.js";
import { tgGetUpdates, tgSendMessage, tgForwardMessage, tgEditMessageCaption } from "./tg-api.js";
import { runForwardAllStore } from "./forward-all/forward-all-store.js";
import { runCaptionAllLookup } from "./caption-all/caption-all-lookup.js";
import { runUploadPics } from "./upload-pics/upload-pics.js";
import state from "./state.js";

export const tgCommandRun = async (inputParams) => {
  if (!inputParams || !state.active || !inputParams.command) return null;
  console.log("!!!INPUT PARAMS RAW");
  console.log(inputParams);

  // add defaults
  const params = await setInputParamDefaults(inputParams);
  const { command, offset } = params;

  console.log("PARAMS");
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
