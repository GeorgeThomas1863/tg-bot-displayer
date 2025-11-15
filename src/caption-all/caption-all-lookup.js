import state from "../util/state.js";

export const runCaptionAllLookup = async (inputParams) => {
  if (!inputParams || !state.active || !inputParams.captionaAllType) return null;
  const { captionaAllType } = inputParams;

  console.log("AHHHHHHHHHHHHHH")
  console.log("CAPTION ALL LOOKUP");
  console.log(inputParams);

  switch (captionaAllType) {
    case "setToFileName":
      return await runSetToFileName(inputParams);
    case "lookupFileName":
      return await runLookupFileName(inputParams);
    case "lookupSpecial":
      return await runLookupSpecial(inputParams);
    case "clearVidCaptions":
      return await runClearVidCaptions(inputParams);
  }
};

export const runSetToFileName = async (inputParams) => {
  if (!state.active) return null;
};

export const runLookupFileName = async (inputParams) => {
  if (!state.active) return null;
};

export const runLookupSpecial = async (inputParams) => {
  if (!state.active) return null;
};

export const runClearVidCaptions = async (inputParams) => {
  if (!state.active) return null;
};
