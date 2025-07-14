import { setInputParamDefaults } from "./util/defaults.js";
import { tgGetUpdates } from "./tg-api.js";

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
  }

  return data;
};
