import { tgForwardMessage } from "../tg-api.js";

export const runForwardAllStore = async (inputParams) => {
  const { messageStart, messageStop, forwardFromId, forwardToId, forwardAllType } = inputParams;
  console.log("INPUT PARAMS");
  console.log(inputParams);

  for (let i = messageStart; i < messageStop; i++) {
    try {
      const messageId = i;
      const forwardParams = { ...inputParams, messageId: messageId };

      //update from forwardAllStore
      const updateCommandType = "forwardMessage";
      forwardParams.commandType = updateCommandType;

      //get forward data
      const forwardData = await tgForwardMessage(forwardParams);
      if (!forwardData) continue;

      //parse by type
      const storeData = await forwardAllParse(forwardData, forwardAllType);
    } catch (e) {
      console.log(e.message + "\n" + e.data + "\n" + e.status);
    }
  }

  return true;
};

export const forwardAllParse = async (inputData, forwardAllType) => {
  if (!inputData || !inputData.result) return null;

  console.log("FORWARD ALL TYPE");
  console.log(inputData.result);

  switch (forwardAllType) {
    case "storeVids":
      break;
    case "storeEverything":
      break;
    case "storeStart":
      break;
    case "storeBlanks":
      break;
  }
};
