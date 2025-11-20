import fs from "fs";
import path from "path";
import state from "../util/state.js";

import { tgPostPicFS } from "../tg-api.js";

export const runUploadPics = async (inputParams) => {
  if (!inputParams || !state.active) return null;
  const { uploadPicType, uploadToId, picPath } = inputParams;

  if (uploadPicType === "uploadSingleFS" || uploadPicType === "uploadFolderFS") return await uploadPicsFS(inputParams);

  //   console.log("RUN UPLOAD PICS");
  //   console.log(inputParams);

  //   const params = {
  //     chatId: uploadToId,
  //     picPath: picPath,
  //   };

  //   const data = await tgPostPicFS(params);
  //   console.log("DATA");
  //   console.log(data);
  //   return data;
};

export const uploadPicsFS = async (inputParams) => {
  if (!inputParams || !state.active) return null;
  const { uploadToId } = inputParams;

  const uploadPicArray = await getUploadPicArray(inputParams);
  if (!uploadPicArray) return null;

  const postPicDataArray = [];
  for (let i = 0; i < uploadPicArray.length; i++) {
    if (!state.active) return null;
    const picPath = uploadPicArray[i];
    const params = {
      chatId: uploadToId,
      picPath: picPath,
    };
    const data = await tgPostPicFS(params);
    if (!data) continue;
    postPicDataArray.push(data);
  }

  return postPicDataArray;
};

export const getUploadPicArray = async (inputParams) => {
  if (!inputParams || !state.active) return null;
  const { uploadPicType } = inputParams;
  let picPath = inputParams.picPath;

  if (uploadPicType === "uploadSingleFS") {
    if (!fs.existsSync(picPath)) {
      console.log(`PIC PATH DOES NOT EXIST: ${picPath}`);
      return null;
    }
    return [picPath];
  }

  if (uploadPicType !== "uploadFolderFS") return null;

  if (picPath.endsWith("/")) picPath = picPath.slice(0, -1);
  if (!fs.existsSync(picPath)) {
    console.log(`PIC PATH DOES NOT EXIST: ${picPath}`);
    return null;
  }

  //build folder
  const uploadPicArray = [];
  const folder = fs.readdirSync(picPath);
  for (let i = 0; i < folder.length; i++) {
    const file = folder[i];
    const filePath = path.join(picPath, file);
    if (!fs.statSync(filePath).isFile()) continue;
    uploadPicArray.push(filePath);
  }

  return uploadPicArray;
};
