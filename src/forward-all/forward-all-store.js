import dbModel from "../../models/db-model.js";
import { tgForwardMessage } from "../tg-api.js";
import { buildVidParams, buildPicParams, buildTextParams } from "../util/params-back.js";
import state from "../util/state.js";

export const runForwardAllStore = async (inputParams) => {
  if (!state.active) return null;

  const { messageStart, messageStop, forwardAllType, collectionSaveTo, dataType, forwardFromId, forwardToId } = inputParams;
  // console.log("INPUT FORWARD ALL STOREPARAMS");
  // console.log(inputParams);

  const returnDataArray = [];
  for (let i = messageStart; i < messageStop; i++) {
    if (!state.active) return null;
    try {
      const forwardParams = {
        forwardToId: forwardToId,
        forwardFromId: forwardFromId,
        messageId: i,
      };

      //get forward data
      const forwardData = await tgForwardMessage(forwardParams);
      if (!forwardData) continue;

      console.log("FORWARD DATA");
      console.log(forwardData);

      const storeObj = await buildStoreObj(forwardData, inputParams);
      if (!storeObj) continue;

      console.log("STORE OBJ");
      console.log(storeObj);

      const storeModel = new dbModel(storeObj, collectionSaveTo);
      const storeData = await storeModel.storeAny();

      console.log("STORE DATA");
      console.log(storeData);

      returnDataArray.push(storeData);
    } catch (e) {
      console.log(e.message + "\n" + e.data + "\n" + e.status);
    }
  }

  return returnDataArray;
};

export const buildStoreObj = async (forwardData, inputParams) => {
  if (!forwardData || !forwardData.result || !inputParams) return null;

  const { forwardAllType } = inputParams;

  if (forwardAllType === "storeVids") return await storeVidObj(forwardData);
  if (forwardAllType === "storeEverything") return await storeEverythingObj(forwardData);
  if (forwardAllType === "storeStart") return await storeStartObj(forwardData);
  if (forwardAllType === "storeBlanks") return await storeBlanksObj(forwardData);

  return null;
};

export const storeEverythingObj = async (forwardData) => {
  if (!forwardData || !forwardData.result) return null;
  const { result } = forwardData;
  const { video, photo, document, text } = result;

  if (video) return await buildVidParams(result);
  if (photo) return await buildPicParams(result);
  if (document) return await buildTextParams(result);
  if (text) return await buildTextParams(result);

  return null;
};

export const storeVidObj = async (forwardData) => {
  if (!forwardData || !forwardData.result || !forwardData.result.video) return null;
  const { result } = forwardData;

  return await buildVidParams(result);
};

export const storeStartObj = async (forwardData) => {
  if (!forwardData || !forwardData.result) return null;
  const { result } = forwardData;
  const { text, video, caption } = result;

  if (text && (text.slice(0, 10).includes("!!!") || text.slice(0, 10).includes("+++"))) {
    return await buildTextParams(result);
  }

  if (video && caption && (caption.slice(0, 10).includes("!!!") || caption.slice(0, 10).includes("+++"))) {
    return await buildVidParams(result);
  }

  return null;
};

export const storeBlanksObj = async (forwardData) => {
  if (!forwardData || !forwardData.result || !forwardData.result.video) return null;
  const { result } = forwardData;
  if (!result.caption || result.caption === "") return await buildVidParams(result);
  return null;
};

// export const parseStoreParams = async (inputData, forwardAllType, dataType) => {
//   if (!state.active) return null;
//   if (!inputData || !inputData.result) return null;

//   // console.log("!!!INPUT DATA!!!");
//   // console.log(inputData);

//   switch (forwardAllType) {
//     case "storeVids":
//       if (!inputData.result.video) return null;

//       //build vid params
//       const vidParams = await buildVidParams(inputData, dataType);
//       return vidParams;

//     case "storeEverything":
//       const everythingParams = await buildEverythingParams(inputData, dataType);
//       return everythingParams;

//     case "storeStart":
//       const startParams = await getStartParams(inputData, dataType);
//       // console.log("!!!START PARAMS!!!");
//       // console.log(startParams);
//       return startParams;

//     case "storeBlanks":
//       if (!inputData.result.video || inputData.result.video.caption) return null;

//       const blankParams = await buildVidParams(inputData, dataType);
//       return blankParams;
//   }
// };

// export const getStartParams = async (inputData, dataType) => {
//   if (!inputData || !inputData.result) return null;
//   const { text, video } = inputData.result;

//   // console.log("!!!INPUT DATA GET START PARAMS!!!");
//   // console.log(inputData);
//   // console.log("TEXT");
//   // console.log(text);
//   // console.log("VIDEO");
//   // console.log(video);

//   if (text) {
//     const trimText = text.trim();
//     if (!trimText.startsWith("!") && !trimText.startsWith("+") && !trimText.startsWith("#")) return null;

//     const textParams = await buildTextParams(inputData);
//     return textParams;
//   }

//   if (video && !video.caption) return null;
//   const { caption } = video;
//   const trimCaption = caption.trim();
//   if (!trimCaption.startsWith("!") && !trimCaption.startsWith("+") && !trimCaption.startsWith("#")) return null;

//   const vidParams = await buildVidParams(inputData, dataType);
//   return vidParams;
// };
