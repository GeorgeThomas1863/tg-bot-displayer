import path from "path";
import state from "../util/state.js";
import dbModel from "../../models/db-model.js";

import { getPicArrayFS } from "./upload-pics.js";
import { tgPostPicFS, tgForwardMessage } from "../tg-api.js";

export const uploadPicMatch = async (inputParams) => {
  if (!inputParams || !state.active) return null;
  const { uploadPicType, uploadToId, collectionPullFrom, collectionSaveTo, collectionPic } = inputParams;

  if (uploadPicType !== "uploadMultiId" && uploadPicType !== "uploadMultiSpecial") return null;

  const uploadPicArray = await getPicArrayFS(inputParams);
  if (!uploadPicArray) return null;
  console.log("UPLOAD PIC ARRAY");
  console.log(uploadPicArray);

  const postPicDataArray = [];
  for (let i = 0; i < uploadPicArray.length; i++) {
    if (!state.active) return null;
    const uploadPicPath = uploadPicArray[i];
    const uploadPicBasePath = path.basename(uploadPicPath).trim();
    const uploadPicId = uploadPicBasePath.split("_")[0];

    console.log("UPLOAD PIC PATH");
    console.log(uploadPicPath);

    //check if in pic in colleciton
    const picCheckParams = {
      keyToLookup: "picId",
      itemValue: uploadPicId,
    };

    const picCheckModel = new dbModel(picCheckParams, collectionPic);
    const picCheckData = await picCheckModel.getUniqueItem();
    console.log("PIC CHECK DATA");
    console.log(picCheckData);
    if (!picCheckData || !picCheckData.vidSaveName) continue;

    //find vid in forward data
    const vidCheckParams = {
      keyToLookup: "fileName",
      itemValue: picCheckData.vidSaveName,
    };

    const vidCheckModel = new dbModel(vidCheckParams, collectionPullFrom);
    const vidCheckData = await vidCheckModel.getUniqueItem();
    console.log("VID CHECK DATA");
    console.log(vidCheckData);
    if (!vidCheckData) continue;

    //ADD VID DOUBLE CHECK HERE

    //post pic
    const postPicParams = {
      chatId: uploadToId,
      picPath: uploadPicPath,
    };

    const postPicData = await tgPostPicFS(postPicParams);
    console.log("POSTED PIC DATA");
    console.log(postPicData.result);
    if (!postPicData) continue;

    //foward vid
    const forwardVidParams = {
      forwardToId: uploadToId,
      forwardFromId: vidCheckData.forwardFromChannelId,
      messageId: vidCheckData.forwardFromMessageId,
    };

    const forwardVidData = await tgForwardMessage(forwardVidParams);
    console.log("FORWARD VID DATA");
    console.log(forwardVidData);
    if (!forwardVidData) continue;

    const storeModel = new dbModel(forwardVidData, collectionSaveTo);
    const storeData = await storeModel.storeAny();
    console.log("STORE DATA");
    console.log(storeData);

    postPicDataArray.push(storeData);
  }

  return postPicDataArray;
};

//--------------------

export const forwardVidMatchPic = async (inputParams) => {
  if (!inputParams || !state.active) return null;
  const { uploadPicType, uploadToId, collectionPullFrom, collectionSaveTo, collectionPic, picPath } = inputParams;

  if (uploadPicType !== "forwardVidMatchPic") return null;

  const postVidModel = new dbModel("", collectionPullFrom);
  const postVidArray = await postVidModel.getAll();
  if (!postVidArray || !postVidArray.length) return null;
  console.log("POST VID ARRAY");
  console.log(postVidArray);

  const postPicDataArray = [];
  for (let i = 0; i < postVidArray.length; i++) {
    try {
      if (!state.active) return null;
      const postVidItem = postVidArray[i];
      const { fileName, forwardFromChannelId, forwardFromMessageId } = postVidItem;
      if (!fileName) continue;

      const fileNameId = fileName.split("_")[0].trim().toLowerCase();
      if (!fileNameId) continue;

      const fileNameCheckParams = {
        keyToLookup: "realId",
        itemValue: fileNameId,
      };

      const fileNameCheckModel = new dbModel(fileNameCheckParams, collectionPic);
      const fileNameCheckData = await fileNameCheckModel.getUniqueItem();
      if (!fileNameCheckData || !fileNameCheckData.picBasePath) continue;

      const uploadPicPath = path.join(picPath, fileNameCheckData.picBasePath);

      const postPicParams = {
        chatId: uploadToId,
        picPath: uploadPicPath,
      };

      const postPicData = await tgPostPicFS(postPicParams);
      console.log("POSTED PIC DATA");
      console.log(postPicData.result);
      if (!postPicData) continue;

      //foward vid
      const forwardVidParams = {
        forwardToId: uploadToId,
        forwardFromId: forwardFromChannelId,
        messageId: forwardFromMessageId,
      };

      const forwardVidData = await tgForwardMessage(forwardVidParams);
      console.log("FORWARD VID DATA");
      console.log(forwardVidData);
      if (!forwardVidData) continue;

      const storeModel = new dbModel(forwardVidData, collectionSaveTo);
      const storeData = await storeModel.storeAny();
      console.log("STORE DATA");
      console.log(storeData);

      postPicDataArray.push(storeData);
    } catch (e) {
      console.log(e.message + "\n" + e.data + "\n" + e.status);
    }
  }

  return postPicDataArray;
};
