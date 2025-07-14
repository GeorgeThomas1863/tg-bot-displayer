import axios from "axios";
import CONFIG from "../config/config.js";
import { tokenArray } from "../config/tg-bot.js";

let tokenIndex = 0;

export const tgGetUpdates = async (params) => {
  const { baseURL } = CONFIG;
  const token = tokenArray[tokenIndex];
  const offset = params?.offset || 0;

  const url = `${baseURL}/bot${token}/getUpdates?offset=${offset}`;
  const res = await axios.get(url);
  const data = await checkToken(res);
  if (data) return data;

  tokenIndex++;
  return await tgGetUpdates(params);
};

export const checkToken = async (res) => {
  try {
    if (!res) {
      const error = new Error("No response from server");
      throw error;
    }

    //set data HERE
    const data = res.data;

    if ((data && data.ok) || res.status === 200) return data;
    if (data.error_code !== 429) {
      const error = new Error("ERROR: " + data);
      throw error;
    }

    //otherwise bot fucked, return null
    console.log("AHHHHHHHHHHHHH");
    tokenIndex++;
    if (tokenIndex > 11) tokenIndex = 0;

    console.log("CANT GET UPDATES TRYING NEW FUCKING BOT. TOKEN INDEX:" + tokenIndex);
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};
