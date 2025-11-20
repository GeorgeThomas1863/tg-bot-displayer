import state from "../util/state.js";

import { tgPostPicFS } from "../tg-api.js";

export const runUploadPics = async (inputParams) => {
  if (!inputParams || !state.active) return null;
  const { uploadPicType, uploadToId, picPath } = inputParams;

  console.log("RUN UPLOAD PICS");
  console.log(inputParams);

  const params = {
    chatId: uploadToId,
    picPath: picPath,
  };

  const data = await tgPostPicFS(params);
  console.log("DATA");
  console.log(data);
  return data;
};

// export const uploadPicFS = async (inputParams) => {
//     if (!inputParams || !state.active) return null;
// }
