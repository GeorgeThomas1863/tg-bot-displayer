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

  //if fucked run again
  if (data === "FUCKED") return await tgGetUpdates(inputParams);

  return data;
};

export const tgSendMessage = async (inputParams) => {
  const { baseURL } = CONFIG;
  const { chatId, text, commandType } = inputParams;
  const token = tokenArray[tokenIndex];

  const params = {
    chat_id: chatId,
    text: text,
  };

  const url = `${baseURL}${token}/${commandType}`;
  const data = await tgPostReq(url, params);
};

//------------------------------

export const tgGetReq = async (url) => {
  if (!url) return null;
  try {
    const res = await axios.get(url);
    if (!res || !res.data) {
      const error = new Error("REQUEST FUCKED");
      error.data = res?.data || null;
      error.status = res?.status || null;
      throw error;
    }

    const data = await checkToken(res.data);
    if (data) return data;

    tokenIndex++;
    return "FUCKED";
  } catch (e) {
    console.log(e.message);
    console.log(e.data);
    console.log(e.status);
    return null;
  }
};

export const tgPostReq = async (url, params) => {
  if (!url || !params) return null;

  console.log("TG POST REQ");
  console.log(url);
  console.log(params);
};

export const checkToken = async (data) => {
  if (data && data.ok) return data;

  if (data.error_code !== 429) {
    const error = new Error("ERROR: " + data.error_code);
    error.data = data;
    error.status = res?.status || null;
    throw error;
  }

  //otherwise bot fucked, return null
  console.log("AHHHHHHHHHHHHH");
  tokenIndex++;

  if (tokenIndex > 11) tokenIndex = 0;

  console.log("CANT GET UPDATES TRYING NEW FUCKING BOT. TOKEN INDEX:" + tokenIndex);
  return null;
};
