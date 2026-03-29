import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import state from "./util/state.js";

let tokenIndex = 0;

const tokenArray = [
  process.env.TOKEN_1,
  process.env.TOKEN_2,
  process.env.TOKEN_3,
  process.env.TOKEN_4,
  process.env.TOKEN_5,
  process.env.TOKEN_6,
  process.env.TOKEN_7,
  process.env.TOKEN_8,
  process.env.TOKEN_9,
  process.env.TOKEN_10,
  process.env.TOKEN_11,
];

export const tgGetUpdates = async (inputParams) => {
  if (!state.active) return null;
  const baseURL = process.env.BASE_URL;
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
  // console.log("!!!TG SEND MESSAGE");
  // console.log(inputParams);
  if (!state.active) return null;
  const baseURL = process.env.BASE_URL;
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
  if (!state.active) return null;
  const baseURL = process.env.BASE_URL;
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
  if (!state.active) return null;
  const baseURL = process.env.BASE_URL;
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

export const tgPostPicFS = async (inputParams) => {
  if (!state.active) return null;
  const baseURL = process.env.BASE_URL;
  const { chatId, picPath } = inputParams;
  const token = tokenArray[tokenIndex];

  const form = new FormData();

  form.append("chat_id", chatId);
  form.append("photo", fs.createReadStream(picPath));

  const url = `${baseURL}${token}/sendPhoto`;
  const data = await tgPostReq(url, form);

  const checkData = await checkToken(data);

  //try again
  if (!checkData) return await tgPostPicFS(inputParams);

  return data;
};

export const tgPostPicURL = async (inputParams) => {
  if (!state.active) return null;
  const baseURL = process.env.BASE_URL;
  const { chatId, picURL } = inputParams;
  const token = tokenArray[tokenIndex];

  const params = {
    chat_id: chatId,
    photo: picURL,
  };

  const url = `${baseURL}${token}/sendPhoto`;
  const data = await tgPostReq(url, params);

  const checkData = await checkToken(data);

  //try again
  if (!checkData) return await tgPostPicURL(inputParams);

  return data;
};

//------------------------------

export const tgGetReq = async (url) => {
  if (!state.active) return null;
  if (!url) return null;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    console.log(e.response.data);
    //axios throws error on 429, so need to return
    return e.response.data;
  }
};

export const tgPostReq = async (url, params) => {
  if (!state.active) return null;
  if (!url || !params) return null;

  try {
    const res = await axios.post(url, params);
    return res.data;
  } catch (e) {
    console.log(e.response.data);
    //axios throws error on 429, so need to return
    return e.response.data;
  }
};

export const checkToken = async (data) => {
  if (!state.active) return null;
  if (data && data.ok) return true;

  if (data && data.error_code && data.error_code !== 429) return true;

  console.log("HERE FAGGOT");
  console.log(data);

  //otherwise bot fucked, return null
  console.log("AHHHHHHHHHHHHH");
  tokenIndex++;

  if (tokenIndex > 10) tokenIndex = 0;

  console.log("CANT GET UPDATES TRYING NEW FUCKING BOT. TOKEN INDEX:" + tokenIndex);
  return null;
};
