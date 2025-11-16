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

// import state from "./state.js";

// export const buildEverythingParams = async (inputParams, dataType = null) => {
//   if (!state.active) return null;
//   if (!inputParams || !inputParams.result) return null;

//   //figure out param type
//   const paramType = await getParamType(inputParams);

//   let data = null;
//   switch (paramType) {
//     case "vidParams":
//       data = await buildVidParams(inputParams, dataType);
//       break;

//     case "picParams":
//       data = await buildPicParams(inputParams);
//       break;

//     case "textParams":
//       data = await buildTextParams(inputParams);
//       break;
//   }

//   return data;
// };

// //calc param type
// export const getParamType = async (inputParams) => {
//   if (!state.active) return null;

//   const { video, photo, document, text } = inputParams.result;

//   if (video) return "vidParams";
//   if (photo) return "picParams";
//   if (text) return "textParams";

//   // console.log("PARAM TYPE!!!");
//   // console.log(inputParams);
// };

// //--------------------------

// //build vid Params
// // export const buildVidParams = async (inputParams, dataType = null) => {
// //   if (!state.active) return null;
// //   if (!inputParams || !inputParams.result || !inputParams.result.video) return null;

// //   // console.log("VID PARAMS");
// //   // console.log(inputParams);

// //   const fileNameRaw = inputParams.result.video.file_name.slice(0, -4);

// //   //CUSTOMIZE TYPE HERE
// //   const vidTypeObj = await getVidType(inputParams, dataType);

// //   // console.log("VIDP PARAMS");
// //   // console.log(inputParams);

// //   const vidParams = {
// //     ...vidTypeObj,
// //     messageId: inputParams.result.message_id,
// //     forwardFromMessageId: inputParams.result.forward_from_message_id,
// //     forwardFromChannelId: inputParams.result.forward_from_chat.id,
// //     forwardFromChannelName: inputParams.result.forward_from_chat.title,
// //     forwardToId: inputParams.result.chat.id,
// //     forwardToName: inputParams.result.chat.title,
// //     fileFullId: inputParams.result.video.file_id,
// //     fileUniqueId: inputParams.result.video.file_unique_id,
// //     fileNameRaw: fileNameRaw,
// //     // fileNameNormal: fileNameNormal,
// //     // kinkId: kinkId,
// //     // vidId: vidId,
// //     caption: inputParams.result.caption,
// //     fileSize: inputParams.result.video.file_size,
// //     videoLength: inputParams.result.video.duration,
// //     datePosted: inputParams.result.date,
// //     dateForwarded: inputParams.result.forward_date,
// //     paramType: "vidParams",
// //     storeDate: new Date(),
// //   };

// //   return vidParams;
// // };

// //parse type HERE (Kink, bang, etc) return obj MAYBE MOVE ELSEWHERE
// export const getVidType = async (inputParams, dataType) => {
//   if (!state.active) return null;
//   if (!inputParams) return null;

//   switch (dataType) {
//     case "kink":
//       // return await buildKinkParams(inputParams);
//       break;
//     case "bang":
//       // return await buildBangParams(inputParams);
//       break;
//     case "other":
//       break;
//   }
//   //BUILD
//   return null;
// };

// //------------------------

// export const buildPicParams = async (inputParams) => {
//   if (!inputParams || !inputParams.result || !inputParams.result.photo) return null;

//   //set null caption
//   if (!inputParams.result.caption) {
//     inputParams.result.caption = "";
//   }

//   // console.log("PIC PARAMS");
//   // console.log(inputParams);

//   //get pic array length
//   const k = inputParams.result.photo.length - 1;

//   const picParams = {
//     messageId: inputParams.result.message_id,
//     forwardFromMessageId: inputParams.result.forward_from_message_id,
//     forwardFromChannelId: inputParams.result.forward_from_chat.id,
//     forwardFromChannelName: inputParams.result.forward_from_chat.title,
//     forwardToId: inputParams.result.chat.id,
//     forwardToName: inputParams.result.chat.title,
//     fileFullId: inputParams.result.photo[k].file_id,
//     fileUniqueId: inputParams.result.photo[k].file_unique_id,
//     caption: inputParams.result.caption,
//     fileSize: inputParams.result.photo[k].file_size,
//     picWidth: inputParams.result.photo[k].width,
//     picHeight: inputParams.result.photo[k].height,
//     datePosted: inputParams.result.date,
//     dateForwarded: inputParams.result.forward_date,
//     paramType: "picParams",
//     storeDate: new Date(),
//   };

//   return picParams;
// };

// export const buildTextParams = async (inputParams) => {
//   if (!inputParams || !inputParams.result || !inputParams.result.text) return null;

//   const textParams = {
//     messageId: inputParams.result.message_id,
//     forwardFromMessageId: inputParams.result.forward_from_message_id,
//     forwardFromChannelId: inputParams.result.forward_from_chat.id,
//     forwardFromChannelName: inputParams.result.forward_from_chat.title,
//     forwardToId: inputParams.result.chat.id,
//     forwardToName: inputParams.result.chat.title,
//     text: inputParams.result.text,
//     datePosted: inputParams.result.date,
//     dateForwarded: inputParams.result.forward_date,
//     paramType: "textParams",
//     storeDate: new Date(),
//   };

//   return textParams;
// };
