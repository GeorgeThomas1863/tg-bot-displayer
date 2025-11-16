import dbModel from "../../models/db-model.js";
import { tgForwardMessage } from "../tg-api.js";
import { buildVidParams, buildEverythingParams, buildTextParams } from "../util/params-back.js";
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

      //parse by type
      // const storeParams = await parseStoreParams(forwardData, forwardAllType, dataType);
      // if (!storeParams) continue;

      // // console.log("!!!STORE PARAM!!!");
      // // console.log(storeParams);

      // const storeModel = new dbModel(storeParams, collectionSaveTo);

      // //if store everything
      // if (forwardAllType === "storeEverything") {
      //   const everythingData = await storeModel.storeAny();
      //   // console.log("EVERYTHING DATA");
      //   // console.log(everythingData);

      //   returnDataArray.push(everythingData);
      //   continue;
      // }

      // //otherwise store unique
      // const storeData = await storeModel.storeUniqueVid();

      // console.log("STORE DATA");
      // console.log(storeData);

      // //for tracking
      // returnDataArray.push(storeData);
    } catch (e) {
      console.log(e.message + "\n" + e.data + "\n" + e.status);
    }
  }

  return true;
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

export const storeVidObj = async (forwardData) => {
  const { result } = forwardData;

  console.log("STORE VID OBJ!!!");
  console.log(forwardData);
  // const { video, message_id, forward_from_message_id, forward_from_chat, chat, date, forward_date } = result;
  // if (!video) return null;

  // const { file_id, file_unique_id, file_name, file_size, duration, caption } = video;



  // const vidParams = {
  //   messageId: forwardData.result.message_id,
  //   forwardFromMessageId: forwardData.result.forward_from_message_id,
  //   forwardFromChannelId: forwardData.result.forward_from_chat.id,
  //   forwardFromChannelName: forwardData.result.forward_from_chat.title,
  //   forwardToId: forwardData.result.chat.id,
  //   forwardToName: forwardData.result.chat.title,
  //   fileFullId: forwardData.result.video.file_id,
  //   fileUniqueId: forwardData.result.video.file_unique_id,
  //   caption: forwardData.result.caption,
  //   fileSize: forwardData.result.video.file_size,
  //   videoLength: forwardData.result.video.duration,
  //   datePosted: forwardData.result.date,
  //   dateForwarded: forwardData.result.forward_date,
  //   paramType: "vidParams",
  //   storeDate: new Date(),
  // };
};

export const storeEverythingObj = async (forwardData) => {};

export const storeStartObj = async (forwardData) => {};

export const storeBlanksObj = async (forwardData) => {};

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
