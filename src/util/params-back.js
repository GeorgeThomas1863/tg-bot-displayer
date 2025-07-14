//build vid Params
export const buildVidParams = async (inputParams, typeInput = null) => {
  if (!inputParams || !inputParams.result) return null;

  //CUSTOMIZE TYPE HERE
  const vidTypeObj = await getVidType(inputParams, typeInput);

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
  };

  return vidParams;
};

//parse type (Kink, bang, etc) return obj
export const getVidType = async (inputParams, typeInput) => {
  //BUILD
  return null;
};
