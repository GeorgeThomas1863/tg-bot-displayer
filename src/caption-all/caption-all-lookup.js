import { tgForwardMessage } from "../tg-api.js";
import state from "../util/state.js";

export const runCaptionAllLookup = async (inputParams) => {
  if (!inputParams || !state.active) return null;
  const { captionAllType, messageStart, messageStop, collectionPullFrom, collectionSaveTo, editChannelId, forwardToId } = inputParams;

  console.log("CAPTION ALL LOOKUP");
  console.log(inputParams);

  const returnDataArray = [];
  for (let i = messageStart; i < messageStop; i++) {
    if (!state.active) return null;
    try {
      const forwardParams = {
        forwardToId: forwardToId,
        forwardFromId: editChannelId,
        messageId: i,
      };

      const forwardData = await tgForwardMessage(forwardParams);
      if (!forwardData) continue;
      console.log("FORWARD DATA");
      console.log(forwardData);
    } catch (e) {
      console.log(e.message + "\n" + e.data + "\n" + e.status);
    }
  }

  // switch (captionAllType) {
  //   case "setToFileName":
  //     return await runSetToFileName(inputParams);
  //   case "lookupFileName":
  //     return await runLookupFileName(inputParams);
  //   case "lookupSpecial":
  //     return await runLookupSpecial(inputParams);
  //   case "clearVidCaptions":
  //     return await runClearVidCaptions(inputParams);
  // }
};

export const runSetToFileName = async (inputParams) => {
  if (!state.active) return null;
  // const { collectionPullFrom, collectionSaveTo, messageStart, messageStop, editChannelId, forwardToId } = inputParams;

  // const returnDataArray = [];
  // for (let i = messageStart; i < messageStop; i++) {
  //   if (!state.active) return null;
  //   try {
  //     const params = {
  //       forwardToId: forwardToId,
  //       forwardFromId: editChannelId,
  //       messageId: i,
  //     };

  //     const forwardData = await tgForwardMessage(params);
  //     if (!forwardData) continue;
  //     console.log("FORWARD DATA");
  //     console.log(forwardData);
  //   } catch (e) {
  //     console.log(e.message + "\n" + e.data + "\n" + e.status);
  //   }
  // }
};

export const runLookupFileName = async (inputParams) => {
  if (!state.active) return null;
};

export const runLookupSpecial = async (inputParams) => {
  if (!state.active) return null;
};

export const runClearVidCaptions = async (inputParams) => {
  if (!state.active) return null;
};
