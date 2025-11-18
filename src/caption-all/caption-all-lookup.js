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

      //needed to avoid failing on blank
      if (captionText === null) continue;

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

  return null;
};

export const getFileNameVid = async (forwardData) => {
  if (!forwardData || !forwardData.result) return null;
  const { video } = forwardData.result;
  if (!video) return null;
  const { file_name } = video;
  return file_name;
};

//build
export const getFileNameLookup = async (forwardData, inputObj) => {
  const { dataType } = inputObj;

  if (dataType.toLowerCase().trim() === "primal") return await getPrimalText(forwardData, inputObj);
};

export const getFileNameSpecial = async (forwardData, inputObj) => {
  const { collectionPullFrom } = inputObj;
  const { video } = forwardData.result;
  if (!video) return null;

  const { file_name } = video;
  const kinkId = parseInt(file_name.split("_")[0]);
  if (!kinkId) return null;

  // console.log("GET FILE NAME SPECIAL; KINK ID");
  // console.log(kinkId);

  const dataModel = new dbModel({ keyToLookup: "kinkShootId", itemValue: kinkId }, collectionPullFrom);
  const itemData = await dataModel.getUniqueItem();
  if (!itemData || !itemData.labelText) return null;

  return itemData.labelText;
};

export const getPrimalText = async (forwardData, inputObj) => {
  const { collectionPullFrom } = inputObj;

  console.log("GET PRIMAL TEXT");
  console.log("FORWARD DATA");
  console.log(forwardData);
  console.log("INPUT OBJ");
  console.log(inputObj);

  const { video } = forwardData.result;
  if (!video) return null;

  const { file_name } = video;

  const primalVidId = file_name.split("_")[0];
  if (!primalVidId) return null;

  const dataModel = new dbModel({ keyToLookup: "realId", itemValue: primalVidId }, collectionPullFrom);
  const itemData = await dataModel.getUniqueItem();
  console.log("ITEM DATA");
  console.log(itemData);
  
  if (!itemData || !itemData.labelText) return null;

  console.log("LABEL TEXT!!");
  console.log(itemData.labelText);

  return itemData.labelText;
};
