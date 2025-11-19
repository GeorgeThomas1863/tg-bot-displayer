export const buildVidParams = async (inputObj) => {
  if (!inputObj || !inputObj.video) return null;
  const { video, message_id, forward_from_message_id, forward_from_chat, chat, caption, date, forward_date } = inputObj;
  const { file_id, file_unique_id, file_name, file_size, duration } = video;

  const vidParams = {
    messageId: message_id,
    forwardFromMessageId: forward_from_message_id,
    forwardFromChannelId: forward_from_chat.id,
    forwardFromChannelName: forward_from_chat.title,
    forwardToId: chat.id,
    forwardToName: chat.title,
    fileFullId: file_id,
    fileUniqueId: file_unique_id,
    fileName: file_name,
    fileSize: file_size,
    videoLength: duration,
    caption: caption,
    datePosted: forward_date,
    dateForwarded: date,
    dateStored: new Date(),
    paramType: "vidParams",
  };

  return vidParams;
};

export const buildPicParams = async (inputObj) => {
  if (!inputObj || !inputObj.photo) return null;
  const { photo, message_id, forward_from_message_id, forward_from_chat, chat, caption, date, forward_date } = inputObj;

  //get input photo array length
  const k = photo.length - 1;
  const { file_id, file_unique_id, file_name, file_size, width, height } = photo[k];

  const picParams = {
    messageId: message_id,
    forwardFromMessageId: forward_from_message_id,
    forwardFromChannelId: forward_from_chat.id,
    forwardFromChannelName: forward_from_chat.title,
    forwardToId: chat.id,
    forwardToName: chat.title,
    fileFullId: file_id,
    fileUniqueId: file_unique_id,
    fileName: file_name,
    fileSize: file_size,
    picWidth: width,
    picHeight: height,
    caption: caption,
    datePosted: forward_date,
    dateForwarded: date,
    dateStored: new Date(),
    paramType: "picParams",
  };

  return picParams;
};

export const buildTextParams = async (inputObj) => {
  if (!inputObj || !inputObj.text) return null;
  const { text, message_id, forward_from_message_id, forward_from_chat, chat, date, forward_date } = inputObj;

  const textParams = {
    messageId: message_id,
    forwardFromMessageId: forward_from_message_id,
    forwardFromChannelId: forward_from_chat.id,
    forwardFromChannelName: forward_from_chat.title,
    forwardToId: chat.id,
    forwardToName: chat.title,
    text: text,
    datePosted: forward_date,
    dateForwarded: date,
    dateStored: new Date(),
    paramType: "textParams",
  };

  return textParams;
};
