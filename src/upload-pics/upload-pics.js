import fs from "fs";
import path from "path";
import state from "../util/state.js";
import dbModel from "../../models/db-model.js";

import { tgPostPicFS, tgPostPicURL, tgForwardMessage } from "../tg-api.js";
import { checkPicURL } from "../util/util.js";

export const runUploadPics = async (inputParams) => {
  if (!inputParams || !state.active) return null;
  const { uploadPicType, uploadToId, collectionPullFrom, collectionSaveTo, collectionExtra } = inputParams;

  if (uploadPicType === "uploadSingleURL" || uploadPicType === "uploadListURL") return await uploadPicURL(inputParams);

  const uploadPicArray = await getPicArrayFS(inputParams);
  console.log("UPLOAD PIC ARRAY");
  console.log(uploadPicArray);

  if (!uploadPicArray) return null;

  const postPicDataArray = [];
  for (let i = 0; i < uploadPicArray.length; i++) {
    if (!state.active) return null;
    try {
      const filePath = uploadPicArray[i];
      const params = {
        chatId: uploadToId,
        picPath: filePath,
      };

      const data = await tgPostPicFS(params);
      if (!data) continue;
      console.log(`POSTED PIC ${i + 1} OF ${uploadPicArray.length}`);
      console.log("POSTED PIC DATA");
      console.log(data.result);

      if (uploadPicType === "uploadSingleFS" || uploadPicType === "uploadFolderFS") {
        postPicDataArray.push(data);
        continue;
      }

      const picBasePath = path.basename(filePath).trim();
      const picId = picBasePath.split("_")[0];

      console.log("PIC ID");
      console.log(picId);

      //KEEP PLAYING WITH IT HERE

      const vidNameParams = {
        keyToLookup: "picId",
        itemValue: picId,
      };

      const vidNameModel = new dbModel(vidNameParams, collectionExtra);
      const vidNameData = await vidNameModel.getUniqueItem();
      if (!vidNameData) continue;

      console.log("VID NAME DATA");
      console.log(vidNameData);

      // const regexParams = {
      //   keyToLookup: "fileName",
      //   regexValue: vidNameData.vidSaveName,
      // };

      const fileDataParams = {
        keyToLookup: "fileName",
        itemValue: vidNameData.vidSaveName,
      };

      const fileDataModel = new dbModel(fileDataParams, collectionPullFrom);
      const fileData = await fileDataModel.getUniqueItem();
      if (!fileData) continue;

      console.log("FILE DATA");
      console.log(fileData);

      const forwardParams = {
        forwardToId: uploadToId,
        forwardFromId: fileData.forwardFromChannelId,
        messageId: fileData.forwardFromMessageId,
      };

      const forwardData = await tgForwardMessage(forwardParams);
      if (!forwardData) continue;
      console.log("FORWARD DATA");
      console.log(forwardData);

      const storeModel = new dbModel(forwardData, collectionSaveTo);
      const storeData = await storeModel.storeAny();
      console.log("STORE DATA");
      console.log(storeData);

      postPicDataArray.push(forwardData);
    } catch (e) {
      console.log(e.message + "\n" + e.data + "\n" + e.status);
    }
  }

  return postPicDataArray;
};

//make capable of handling array of URLs
export const uploadPicURL = async (inputParams) => {
  if (!inputParams || !state.active) return null;
  const { picPath, uploadToId } = inputParams;

  const picCheck = await checkPicURL(picPath);
  if (!picCheck) {
    console.log(`PIC URL IS INVALID: ${picPath}`);
    return null;
  }

  const params = {
    chatId: uploadToId,
    picURL: picPath,
  };

  console.log("PARAMS");
  console.log(params);

  const data = await tgPostPicURL(params);
  if (!data) return null;
  console.log("POSTED PIC URL DATA");
  console.log(data);

  return data;
};

export const getPicArrayFS = async (inputParams) => {
  if (!inputParams || !state.active) return null;
  const { uploadPicType } = inputParams;
  let picPath = inputParams.picPath;

  if (uploadPicType === "uploadSingleFS") {
    if (!fs.existsSync(picPath) || !fs.statSync(picPath).isFile()) {
      console.log(`PIC PATH DOES NOT EXIST OR IS NOT A FILE: ${picPath}`);
      return null;
    }
    return [picPath];
  }

  if (uploadPicType === "uploadSingleURL" || uploadPicType === "uploadListURL") return null;

  if (picPath.endsWith("/") || picPath.endsWith("\\")) picPath = picPath.slice(0, -1);

  //build folder
  const uploadPicArray = [];
  const folder = fs.readdirSync(picPath).sort();

  for (let i = 0; i < folder.length; i++) {
    const file = folder[i];
    const filePath = path.join(picPath, file);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      console.log(`PIC PATH IS NOT A FILE OR DOES NOT EXIST: ${filePath}`);
      continue;
    }
    uploadPicArray.push(filePath);
  }

  return uploadPicArray;
};

// export const getPicMatchId = async (filePath, inputParams) => {
//   if (!filePath || !inputParams) return null;
//   const { dataType, collectionExtra } = inputParams;

//   //make unique for primal
//   if (dataType.toLowerCase().trim() !== "primal") return filePath;

//   const picRawId = basePath.split("_")[0];

//   const dataModel1 = new dbModel({ keyToLookup: "realId", itemValue: picRawId }, collectionExtra);
//   const dataCheck1 = await dataModel1.getUniqueItem();
//   if (dataCheck1 && dataCheck1.realId) return dataCheck1.realId;

//   const dataModel2 = new dbModel({ keyToLookup: "vidRealId", itemValue: picRawId }, collectionExtra);
//   const dataCheck2 = await dataModel2.getUniqueItem();
//   if (dataCheck2 && dataCheck2.realId) return dataCheck2.realId;

//   const dataModel3 = new dbModel({ keyToLookup: "primalId", itemValue: picRawId }, collectionExtra);
//   const dataCheck3 = await dataModel3.getUniqueItem();
//   if (dataCheck3 && dataCheck3.realId) return dataCheck3.realId;

//   return null;
// };
