import { setInputParamDefaults } from "./util/defaults.js";
import { tgGetUpdates, tgSendMessage, tgForwardMessage, tgEditMessageCaption } from "./tg-api.js";
import { runForwardAllStore } from "./forward-all/forward-all-store.js";
import { runCaptionAllLookup } from "./caption-all/caption-all-lookup.js";
import { runUploadPics } from "./upload-pics/upload-pics.js";
import state from "./state.js";

export const tgCommandRun = async (inputParams) => {
  // if (!inputParams) return null;
  // if (!state.active) return null;
  console.log("!!!INPUT PARAMS");
  console.log(inputParams);

  //add defaults
  // const params = await setInputParamDefaults(inputParams);
  // const { commandType, offset } = params;

  // // console.log("PARAMS");
  // // console.log(params);

  // let data = null;
  // switch (commandType) {
  //   case "getUpdates":
  //     data = await tgGetUpdates({ offset: offset });
  //     break;

  //   case "sendMessage":
  //     data = await tgSendMessage(params);
  //     break;

  //   case "forwardMessage":
  //     data = await tgForwardMessage(params);
  //     break;

  //   case "editMessageCaption":
  //     data = await tgEditMessageCaption(params);
  //     break;

  //   //---------------

  //   case "forwardAllStore":
  //     data = await runForwardAllStore(params);
  //     break;

  //   case "captionAllLookup":
  //     data = await runCaptionAllLookup(params);
  //     break;

  //   case "sendPhoto":
  //     data = await runUploadPics(params);
  //     break;
  // }

  return data;
};
