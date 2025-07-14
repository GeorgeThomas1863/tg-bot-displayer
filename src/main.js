import { setInputParamDefaults } from "./util/defaults.js";
import { tgGetUpdates } from "./tg-api.js";

export const tgCommandRun = async (inputParams) => {
  if (!inputParams) return null;

  //add defaults
  const params = await setInputParamDefaults(inputParams);
  const { commandType } = params;

  console.log("PARAMS");
  console.log(params);

  let data = null;
  switch (commandType) {
    case "getUpdates":
      data = await tgGetUpdates(params);
      break;
  }

  console.log("DATA");
  console.log(data);
  //     case "sendMessage":
  //       data = await sendMessage(params);
  //       break;
  //     case "editMessage":
  //       data = await editMessage(params);
  //       break;
  //     case "deleteMessage":
  //       data = await deleteMessage(params);
  //   }
};
