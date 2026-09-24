import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import state from "./util/state.js";

import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

let tokenIndex = 0;

const INITIAL_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 60 * 1000;
const MAX_RATE_LIMIT_WAIT_MS = 60 * 60 * 1000;
const SLEEP_SLICE_MS = 1000;

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
    if (!responseData) return logTransportError(e);
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
    if (!responseData) return logTransportError(e);
    console.log(responseData);
    return responseData;
  }
};

const logTransportError = (e) => {
  console.log(`TG TRANSPORT ERROR (no response from API): ${e?.code || ""} ${e?.message || e}`);
  return null;
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
  const deadlineMs = Date.now() + MAX_RATE_LIMIT_WAIT_MS;
  let backoffMs = INITIAL_BACKOFF_MS;

  while (state.active) {
    const result = await runTokenPass(requestToken);
    if (result.data !== null) return result.data;
    if (!state.active) return null;
    if (Date.now() >= deadlineMs) stopForRateLimitDeadline();

    const waitMs = pickWaitMs(result.retryAfterSeconds, backoffMs);
    const isStillActive = await sleepWhileActive(waitMs);
    if (!isStillActive) return null;

    backoffMs = Math.min(backoffMs * 2, MAX_BACKOFF_MS);
  }

  return null;
};

const runTokenPass = async (requestToken) => {
  const startIndex = tokenIndex;
  let retryAfterSeconds = null;

  for (let attempt = 0; attempt < tokenArray.length; attempt++) {
    if (!state.active) return { data: null, retryAfterSeconds };

    const token = tokenArray[(startIndex + attempt) % tokenArray.length];
    const data = await requestToken(token);
    const currentRetryAfter = readRetryAfter(data);
    if (currentRetryAfter !== null && (retryAfterSeconds === null || currentRetryAfter < retryAfterSeconds)) {
      retryAfterSeconds = currentRetryAfter;
    }

    const isAccepted = await checkToken(data);
    if (isAccepted) return { data, retryAfterSeconds };
  }

  return { data: null, retryAfterSeconds };
};

const readRetryAfter = (data) => {
  if (data?.error_code !== 429) return null;

  const retryAfterSeconds = data.parameters?.retry_after;
  if (typeof retryAfterSeconds !== "number") return null;
  if (!Number.isFinite(retryAfterSeconds) || retryAfterSeconds < 0) return null;

  return retryAfterSeconds;
};

const pickWaitMs = (retryAfterSeconds, backoffMs) => {
  if (retryAfterSeconds === null) return Math.min(backoffMs, MAX_BACKOFF_MS);
  return Math.min(retryAfterSeconds * 1000, MAX_BACKOFF_MS);
};

const sleepWhileActive = async (milliseconds) => {
  let remainingMs = milliseconds;

  while (remainingMs > 0) {
    if (!state.active) return false;
    const sliceMs = Math.min(remainingMs, SLEEP_SLICE_MS);
    await new Promise((resolve) => setTimeout(resolve, sliceMs));
    remainingMs -= sliceMs;
  }

  return state.active;
};

const stopForRateLimitDeadline = () => {
  const message = "Rate limit deadline exceeded after 60 minutes; stopping all operations";
  console.log(`ERROR: ${message}`);
  state.active = false;
  throw new Error(message);
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
