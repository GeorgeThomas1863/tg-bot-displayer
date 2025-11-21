import fs from "fs";
import path from "path";
import state from "../util/state.js";

import { tgPostPicFS, tgPostPicURL } from "../tg-api.js";
import { checkPicURL } from "../util/util.js";

export const runUploadPics = async (inputParams) => {
  if (!inputParams || !state.active) return null;
  const { uploadPicType, uploadToId, dataType } = inputParams;

  if (uploadPicType === "uploadSingleURL" || uploadPicType === "uploadListURL") return await uploadPicURL(inputParams);

  const uploadPicArray = await getPicArrayFS(inputParams);
  console.log("UPLOAD PIC ARRAY");
  console.log(uploadPicArray);

  if (!uploadPicArray) return null;

  const postPicDataArray = [];
  for (let i = 0; i < uploadPicArray.length; i++) {
    if (!state.active) return null;
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
    postPicDataArray.push(data);

    if (uploadPicType === "uploadSingleFS" || uploadPicType === "uploadFolderFS") continue;

    const basePath = path.basename(filePath);

    const picId = await getPicId(basePath, dataType);

    console.log("BASE PATH");
    console.log(basePath);
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

// export const uploadPicMatch = async (inputParams) => {
//   if (!inputParams || !state.active) return null;
// };

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
  const folder = fs.readdirSync(picPath);

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

export const getPicId = async (basePath, dataType) => {
  if (!basePath) return null;

  //make unique for primal
  if (dataType.toLowerCase().trim() !== "primal") return basePath;

  const picRawId = basePath.split("_")[0];
};
