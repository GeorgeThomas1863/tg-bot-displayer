import dbModel from "../../models/db-model.js";
import { tgForwardMessage } from "../tg-api.js";
import { buildVidParams, buildEverythingParams } from "../util/params-back.js";
import state from "../state.js";

export const runForwardAllStore = async (inputParams) => {
  if (!state.active) return null;

  const { messageStart, messageStop, forwardAllType, collectionSaveTo, dataType } = inputParams;
  console.log("INPUT PARAMS");
  console.log(inputParams);

  const returnDataArray = [];
  for (let i = messageStart; i < messageStop; i++) {
    if (!state.active) return null;
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
      const storeParams = await parseStoreParams(forwardData, forwardAllType, dataType);
      if (!storeParams) continue;

      console.log("STORE PARAMS");
      console.log(storeParams);

      const storeModel = new dbModel(storeParams, collectionSaveTo);

      //if store everything
      if (forwardAllType === "storeEverything") {
        const everythingData = await storeModel.storeAnyData();
        console.log("EVERYTHING DATA");
        console.log(everythingData);

        returnDataArray.push(everythingData);
        continue;
      }

      //otherwise store unique
      const storeData = await storeModel.storeUniqueVid();

      console.log("STORE DATA");
      console.log(storeData);

      //for tracking
      returnDataArray.push(storeData);
    } catch (e) {
      console.log(e.message + "\n" + e.data + "\n" + e.status);
    }
  }

  return true;
};

export const parseStoreParams = async (inputData, forwardAllType, dataType) => {
  if (!state.active) return null;
  if (!inputData || !inputData.result) return null;

  switch (forwardAllType) {
    case "storeVids":
      if (!inputData.result.video) return null;

      //build vid params
      const vidParams = await buildVidParams(inputData, dataType);
      return vidParams;

    case "storeEverything":
      const everythingParams = await buildEverythingParams(inputData, dataType);
      return everythingParams;

    case "storeStart":
      if (!inputData.result.video || !inputData.result.video.caption) return null;
      const { caption } = inputData.result.video;
      const beginningChars = caption.substring(0, 3);
      if (beginningChars !== "!!!" || beginningChars !== "+++") return null;

      const startParams = await buildVidParams(inputData, dataType);
      return startParams;

    case "storeBlanks":
      if (!inputData.result.video || inputData.result.video.caption) return null;

      const blankParams = await buildVidParams(inputData, dataType);
      return blankParams;
  }
};
