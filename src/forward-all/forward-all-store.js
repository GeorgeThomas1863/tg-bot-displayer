import dbModel from "../../models/db-model.js";
import { tgForwardMessage } from "../tg-api.js";
import { buildVidParams } from "../util/params-back.js";

export const runForwardAllStore = async (inputParams) => {
  const { messageStart, messageStop, forwardFromId, forwardToId, forwardAllType } = inputParams;
  console.log("INPUT PARAMS");
  console.log(inputParams);

  for (let i = messageStart; i < messageStop; i++) {
    try {
      const messageId = i;
      const forwardParams = { ...inputParams, messageId: messageId };

      //update from forwardAllStore
      const updateCommandType = "forwardMessage";
      forwardParams.commandType = updateCommandType;

      //get forward data
      const forwardData = await tgForwardMessage(forwardParams);
      if (!forwardData) continue;

      //parse by type
      const storeData = await forwardAllParse(forwardData, inputParams);
    } catch (e) {
      console.log(e.message + "\n" + e.data + "\n" + e.status);
    }
  }

  return true;
};

export const forwardAllParse = async (forwardData, inputParams) => {
  if (!forwardData || !forwardData.result) return null;
  const { forwardAllType, collectionSaveTo } = inputParams;

  console.log("FORWARD ALL TYPE");
  console.log(forwardData.result);

  switch (forwardAllType) {
    case "storeVids":
      if (!forwardData.result.video) return null;

      //build vid params
      const vidParams = await buildVidParams(forwardData, "kink");
      if (!vidParams) return null;

      const storeModel = new dbModel(vidParams, collectionSaveTo);
      const storeData = await storeModel.storeUniqueVid();
      return storeData;
    case "storeEverything":
      break;
    case "storeStart":
      break;
    case "storeBlanks":
      break;
  }
};
