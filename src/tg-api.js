import axios from "axios";
import CONFIG from "../config/config.js";
import tokenArray from "../config/tg-bot.js";

let tokenIndex = 0;

export const tgGetUpdates = async (inputParams) => {
  const { baseURL } = CONFIG;
  const { offset } = inputParams;
  const token = tokenArray[tokenIndex];

  const url = `${baseURL}${token}/getUpdates?offset=${offset}`;
  const data = await tgGetReq(url);

  const checkData = await checkToken(data);

  //if fucked run again
  if (!checkData) return await tgGetUpdates(inputParams);

  return data;
};

export const tgSendMessage = async (inputParams) => {
  const { baseURL } = CONFIG;
  const { chatId, text } = inputParams;
  const token = tokenArray[tokenIndex];

  const params = {
    chat_id: chatId,
    text: text,
  };

  const url = `${baseURL}${token}/sendMessage`;
  const data = await tgPostReq(url, params);

  const checkData = await checkToken(data);

  //try again
  if (!checkData) return await tgSendMessage(inputParams);

  return data;
};

export const tgForwardMessage = async (inputParams) => {
  const { baseURL } = CONFIG;
  const { forwardToId, forwardFromId, messageId } = inputParams;
  const token = tokenArray[tokenIndex];

  const params = {
    chat_id: forwardToId,
    from_chat_id: forwardFromId,
    message_id: messageId,
  };

  const url = `${baseURL}${token}/forwardMessage`;
  const data = await tgPostReq(url, params);

  const checkData = await checkToken(data);

  //try again
  if (!checkData) return await tgForwardMessage(inputParams);

  return data;
};

export const tgEditMessageCaption = async (inputParams) => {
  const { baseURL } = CONFIG;
  const { editChannelId, messageId, caption } = inputParams;
  const token = tokenArray[tokenIndex];

  const params = {
    chat_id: editChannelId,
    message_id: messageId,
    caption: caption,
  };

  const url = `${baseURL}${token}/editMessageCaption`;
  const data = await tgPostReq(url, params);

  const checkData = await checkToken(data);

  //try again
  if (!checkData) return await tgEditMessageCaption(inputParams);

  return data;
};

//------------------------------

export const tgGetReq = async (url) => {
  if (!url) return null;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    console.log(e.message);
    //axios throws error on 429, so need to return
    return e.response.data;
  }
};

export const tgPostReq = async (url, params) => {
  if (!url || !params) return null;

  try {
    const res = await axios.post(url, params);
    return res.data;
  } catch (e) {
    console.log(e.message);
    //axios throws error on 429, so need to return
    return e.response.data;
  }
};

export const checkToken = async (data) => {
  if (data && data.ok) return true;

  console.log("HERE FAGGOT");
  console.log(data);

  if (data && data.error_code && data.error_code !== 429) return true;

  //otherwise bot fucked, return null
  console.log("AHHHHHHHHHHHHH");
  tokenIndex++;

  if (tokenIndex > 11) tokenIndex = 0;

  console.log("CANT GET UPDATES TRYING NEW FUCKING BOT. TOKEN INDEX:" + tokenIndex);
  return null;
};
