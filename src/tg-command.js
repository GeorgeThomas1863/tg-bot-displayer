import { setInputParamDefaults } from "./util/defaults.js";
import { tgGetUpdates, tgSendMessage } from "./tg-api.js";

export const tgCommandRun = async (inputParams) => {
  if (!inputParams) return null;

  //add defaults
  const params = await setInputParamDefaults(inputParams);
  const { commandType, offset } = params;

  console.log("PARAMS");
  console.log(params);

  let data = null;
  switch (commandType) {
    case "getUpdates":
      data = await tgGetUpdates({ offset: offset });
      break;

    case "sendMessage":
      data = await tgSendMessage(params)
      break
  }

  return data;
};
