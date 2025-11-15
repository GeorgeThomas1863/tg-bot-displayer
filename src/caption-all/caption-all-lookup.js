import { tgForwardMessage, tgEditMessageCaption } from "../tg-api.js";
import dbModel from "../../models/db-model.js";
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

      const captionText = await getCaptionText(forwardData, inputParams);
      if (!captionText) continue;

      // console.log("CAPTION TEXT");
      // console.log(captionText);

      const editParams = {
        editChannelId: forwardData.result.forward_from_chat.id,
        messageId: forwardData.result.forward_from_message_id,
        caption: captionText,
      };

      const editData = await tgEditMessageCaption(editParams);
      if (!editData || !editData.result) continue;

      const storeModel = new dbModel(editData, collectionSaveTo);
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

export const getCaptionText = async (forwardData, inputObj) => {
  if (!forwardData || !forwardData.result || !inputObj) return null;
  const { captionAllType } = inputObj;

  if (captionAllType === "setToFileName") return await getFileNameVid(forwardData);
  if (captionAllType === "lookupFileName") return await getFileNameLookup(forwardData, inputObj);
  if (captionAllType === "lookupSpecial") return await getFileNameSpecial(forwardData, inputObj);
  if (captionAllType === "clearVidCaptions") return "";

  return true;
};

export const getFileNameVid = async (forwardData) => {
  if (!forwardData || !forwardData.result) return null;
  const { video } = forwardData.result;
  if (!video) return null;
  const { file_name } = video;
  return file_name;
};

//build
export const getFileNameLookup = async (forwardData, inputObj) => {};

export const getFileNameSpecial = async (forwardData, inputObj) => {
  console.log("GET FILE NAME SPECIAL");
  console.log(inputObj);
  return true;
};
