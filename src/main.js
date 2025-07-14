import { setInputParamDefaults } from "./util/defaults.js";

export const tgCommandRun = async (inputParams) => {
  if (!inputParams) return null;

  //add defaults
  const params = await setInputParamDefaults(inputParams);
  const { commandType } = params;

  console.log("PARAMS");
  console.log(params);

  let data = null;
  //   switch (commandType) {
  //     case "getUpdates":
  //       data = await forward(params);
  //       break;
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
