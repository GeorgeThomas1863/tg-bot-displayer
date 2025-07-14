export const buildEverythingParams = async (inputParams, dataType = null) => {
  if (!inputParams || !inputParams.result) return null;

  //figure out param type
  const paramType = await getParamType(inputParams);

  let data = null;
  switch (paramType) {
    case "vidParams":
      data = await buildVidParams(inputParams, dataType);
      break;
  }

  return data;
};

//calc param type
export const getParamType = async (inputParams) => {
  const { video, photo, document } = inputParams.result;

  console.log("PARAM TYPE!!!");
  console.log(inputParams);

  if (video) return "vidParams";
};

//build vid Params
export const buildVidParams = async (inputParams, dataType = null) => {
  if (!inputParams || !inputParams.result) return null;

  //CUSTOMIZE TYPE HERE
  const vidTypeObj = await getVidType(inputParams, dataType);

  const vidParams = {
    ...vidTypeObj,
    messageId: inputParams.result.message_id,
    forwardFromMessageId: inputParams.result.forward_from_message_id,
    forwardFromChannelId: inputParams.result.forward_from_chat.id,
    forwardFromChannelName: inputParams.result.forward_from_chat.title,
    forwardToId: inputParams.result.chat.id,
    forwardToName: inputParams.result.chat.title,
    fileFullId: inputParams.result.video.file_id,
    fileUniqueId: inputParams.result.video.file_unique_id,
    // fileName: fileNameRaw,
    // fileNameNormal: fileNameNormal,
    // kinkId: kinkId,
    // vidId: vidId,
    caption: inputParams.result.caption,
    fileSize: inputParams.result.video.file_size,
    videoLength: inputParams.result.video.duration,
    datePosted: inputParams.result.date,
    dateForwarded: inputParams.result.forward_date,
    paramType: "vidParams",
    storeDate: new Date(),
  };

  return vidParams;
};

//parse type HERE (Kink, bang, etc) return obj
export const getVidType = async (inputParams, dataType) => {
  if (!inputParams) return null;

  switch (dataType) {
    case "kink":
      // return await buildKinkParams(inputParams);
      break;
    case "bang":
      // return await buildBangParams(inputParams);
      break;
    case "other":
      break;
  }
  //BUILD
  return null;
};
