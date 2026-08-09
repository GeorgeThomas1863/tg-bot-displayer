import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import state from "./util/state.js";

import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

let tokenIndex = 0;

const tokenArray = loadTokens();

export const tgGetUpdates = async (inputParams) => {
  if (!state.active) return null;
  const baseURL = process.env.BASE_URL;
  const { offset } = inputParams;

  return await runWithTokenRetry(async (token) => {
    const url = `${baseURL}${token}/getUpdates?offset=${offset}`;
    return await tgGetReq(url);
  });
};

export const tgSendMessage = async (inputParams) => {
  if (!state.active) return null;
  const baseURL = process.env.BASE_URL;
  const { chatId, text } = inputParams;
  const params = {
    chat_id: chatId,
    text: text,
  };

  return await runWithTokenRetry(async (token) => {
    const url = `${baseURL}${token}/sendMessage`;
    return await tgPostReq(url, params);
  });
};

export const tgForwardMessage = async (inputParams) => {
  if (!state.active) return null;
  const baseURL = process.env.BASE_URL;
  const { forwardToId, forwardFromId, messageId } = inputParams;
  const params = {
    chat_id: forwardToId,
    from_chat_id: forwardFromId,
    message_id: messageId,
  };

  return await runWithTokenRetry(async (token) => {
    const url = `${baseURL}${token}/forwardMessage`;
    return await tgPostReq(url, params);
  });
};

export const tgEditMessageCaption = async (inputParams) => {
  if (!state.active) return null;
  const baseURL = process.env.BASE_URL;
  const { editChannelId, messageId, caption } = inputParams;
  const params = {
    chat_id: editChannelId,
    message_id: messageId,
    caption: caption,
  };

  return await runWithTokenRetry(async (token) => {
    const url = `${baseURL}${token}/editMessageCaption`;
    return await tgPostReq(url, params);
  });
};

export const tgPostPicFS = async (inputParams) => {
  if (!state.active) return null;
  const baseURL = process.env.BASE_URL;
  const { chatId, picPath } = inputParams;

  return await runWithTokenRetry(async (token) => {
    const form = new FormData();
    form.append("chat_id", chatId);
    form.append("photo", fs.createReadStream(picPath));

    const url = `${baseURL}${token}/sendPhoto`;
    return await tgPostReq(url, form);
  });
};

export const tgPostPicURL = async (inputParams) => {
  if (!state.active) return null;
  const baseURL = process.env.BASE_URL;
  const { chatId, picURL } = inputParams;
  const params = {
    chat_id: chatId,
    photo: picURL,
  };

  return await runWithTokenRetry(async (token) => {
    const url = `${baseURL}${token}/sendPhoto`;
    return await tgPostReq(url, params);
  });
};

//------------------------------

export const tgGetReq = async (url) => {
  if (!state.active) return null;
  if (!url) return null;

  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    const responseData = e.response?.data;
    if (!responseData) return null;
    console.log(responseData);
    return responseData;
  }
};

export const tgPostReq = async (url, params) => {
  if (!state.active) return null;
  if (!url || !params) return null;

  try {
    const res = await axios.post(url, params);
    return res.data;
  } catch (e) {
    const responseData = e.response?.data;
    if (!responseData) return null;
    console.log(responseData);
    return responseData;
  }
};

export const checkToken = async (data) => {
  if (!state.active) return null;
  if (data && data.ok === true) return true;
  if (data && data.error_code && data.error_code !== 429) return true;

  tokenIndex++;
  if (tokenIndex >= tokenArray.length) tokenIndex = 0;

  console.log(`token rejected, rotating; index now ${tokenIndex}`);
  return null;
};

const runWithTokenRetry = async (requestToken) => {
  for (let attempt = 0; attempt < tokenArray.length; attempt++) {
    if (!state.active) return null;

    const token = tokenArray[tokenIndex];
    const data = await requestToken(token);
    const isAccepted = await checkToken(data);
    if (isAccepted) return data;

    if (attempt === tokenArray.length - 1) return null;
    await waitForRetry(data);
  }

  return null;
};

const waitForRetry = async (data) => {
  if (data?.error_code !== 429) return;

  const retryAfter = Number(data.parameters?.retry_after);
  if (!Number.isFinite(retryAfter) || retryAfter <= 0) return;

  await sleep(Math.min(retryAfter, 60) * 1000);
};

const sleep = async (milliseconds) => {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
};

function loadTokens() {
  const tokenKeys = process.env.TOKEN_ARRAY;
  if (!tokenKeys) {
    throw new Error("TOKEN_ARRAY is not set or contains no usable tokens");
  }

  const tokens = tokenKeys
    .split(",")
    .map((key) => process.env[key.trim()]?.trim())
    .filter(Boolean);

  if (!tokens.length) {
    throw new Error("TOKEN_ARRAY is not set or contains no usable tokens");
  }

  return tokens;
}
