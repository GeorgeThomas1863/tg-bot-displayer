export const buildEverythingParams = async (inputParams, dataType = null) => {
  if (!inputParams || !inputParams.result) return null;

  //figure out param type
  const paramType = await getParamType(inputParams);

  let data = null;
  switch (paramType) {
    case "vidParams":
      data = await buildVidParams(inputParams, dataType);
      break;

    case "picParams":
      data = await buildPicParams(inputParams);
      break;

    case "textParams":
      data = await buildTextParams(inputParams);
      break;
  }

  return data;
};

//calc param type
export const getParamType = async (inputParams) => {
  const { video, photo, document, text } = inputParams.result;

  if (video) return "vidParams";
  if (photo) return "picParams";
  if (text) return "textParams";

  console.log("PARAM TYPE!!!");
  console.log(inputParams);
};

//--------------------------

//build vid Params
export const buildVidParams = async (inputParams, dataType = null) => {
  if (!inputParams || !inputParams.result || !inputParams.result.video) return null;

  console.log("VID PARAMS");
  console.log(inputParams);

  const fileNameRaw = inputParams.result.video.file_name.slice(0, -4);

  //CUSTOMIZE TYPE HERE
  const vidTypeObj = await getVidType(inputParams, dataType);

  // console.log("VIDP PARAMS");
  // console.log(inputParams);

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
    fileNameRaw: fileNameRaw,
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

//parse type HERE (Kink, bang, etc) return obj MAYBE MOVE ELSEWHERE
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

//------------------------

export const buildPicParams = async (inputParams) => {
  if (!inputParams || !inputParams.result || !inputParams.result.photo) return null;

  //set null caption
  if (!inputParams.result.caption) {
    inputParams.result.caption = "";
  }

  // console.log("PIC PARAMS");
  // console.log(inputParams);

  //get pic array length
  const k = inputParams.result.photo.length - 1;

  const picParams = {
    messageId: inputParams.result.message_id,
    forwardFromMessageId: inputParams.result.forward_from_message_id,
    forwardFromChannelId: inputParams.result.forward_from_chat.id,
    forwardFromChannelName: inputParams.result.forward_from_chat.title,
    forwardToId: inputParams.result.chat.id,
    forwardToName: inputParams.result.chat.title,
    fileFullId: inputParams.result.photo[k].file_id,
    fileUniqueId: inputParams.result.photo[k].file_unique_id,
    caption: inputParams.result.caption,
    fileSize: inputParams.result.photo[k].file_size,
    picWidth: inputParams.result.photo[k].width,
    picHeight: inputParams.result.photo[k].height,
    datePosted: inputParams.result.date,
    dateForwarded: inputParams.result.forward_date,
    paramType: "picParams",
    storeDate: new Date(),
  };

  return picParams;
};

export const buildTextParams = async (inputParams) => {
  if (!inputParams || !inputParams.result || !inputParams.result.text) return null;

  const textParams = {
    messageId: inputParams.result.message_id,
    forwardFromMessageId: inputParams.result.forward_from_message_id,
    forwardFromChannelId: inputParams.result.forward_from_chat.id,
    forwardFromChannelName: inputParams.result.forward_from_chat.title,
    forwardToId: inputParams.result.chat.id,
    forwardToName: inputParams.result.chat.title,
    text: inputParams.result.text,
    datePosted: inputParams.result.date,
    dateForwarded: inputParams.result.forward_date,
    paramType: "textParams",
    storeDate: new Date(),
  };

  return textParams;
};
