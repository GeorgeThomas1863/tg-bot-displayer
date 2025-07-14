import axios from "axios";
import CONFIG from "../config/config.js";
import tokenArray from "../config/tg-bot.js";

let tokenIndex = 0;

export const tgGetUpdates = async (params) => {
  const { baseURL } = CONFIG;
  const { offset } = params;
  const token = tokenArray[tokenIndex];

  const url = `${baseURL}${token}/getUpdates?offset=${offset}`;
  const data = await tgGetReq(url);

  //if fucked run again
  if (data === "FUCKED") return await tgGetUpdates(params);

  return data;
};

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
    return "FUCKED"
  } catch (e) {
    console.log(e.message);
    console.log(e.data);
    console.log(e.status);
    return null;
  }
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
