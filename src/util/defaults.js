//Set to default
export const setInputParamDefaults = async (inputParams) => {
  const paramsDefaultAdded = await addDefaultParams(inputParams);
  // const paramsCommandsAdded = await addCommandParams(paramsDefaultAdded);
  const finishedParams = await addCallParams(paramsDefaultAdded);

  return finishedParams;
};

const addDefaultParams = async (inputParams) => {
  //DEFAULTS
  const defaultObject = {
    messageStart: 0,
    messageStop: 20,
    // forwardFromId: -1002418863636,
    // forwardFromId: -1002230354437,
    forwardFromId: -1002123668375, //random stuff
    forwardToId: -1002468318224, //forwardTest53
    uploadToId: -1002468318224,
    editChannelId: -1002230354437,
    collectionPullFrom: "balls1",
    collectionSaveTo: "balls2",
    picPath: "G:/PICS/",
    //picPath: "/home/george/code/pics/",
    chatId: 552805041,
    messageId: 1,
    text: "bundle of sticks",
    caption: "",
    offset: "",
  };

  for (let key1 in inputParams) {
    if (inputParams[key1] !== "" && inputParams[key1] !== 0) {
      continue;
    }

    for (let key2 in defaultObject) {
      if (key2 === key1) {
        inputParams[key1] = defaultObject[key2];
      }
    }
  }
  return inputParams;
};

const addCallParams = async (inputParams) => {
  const methodObject = {
    // 1: "tgGet",
    // 2: "tgPost",
    // 3: "tgPost",
    // 4: "tgPost",
    5: "forwardLoop",
    6: "captionLoop",
    7: "picLoop",
  };

  for (let key in methodObject) {
    if (+key === +inputParams.commandId) {
      inputParams.call = methodObject[key];
    }
  }

  return inputParams;
};
