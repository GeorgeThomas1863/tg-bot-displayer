import { tgCommandRun } from "../src/src.js";
import state from "../src/util/state.js";

export const tgCommandControl = async (req, res) => {
  const inputParams = req.body;

  if (inputParams.command === "stop") {
    state.active = false;
    console.log("STOPPED EXECUTION");
    return res.json({ message: "STOPPED" });
  }

  state.active = true;

  const data = await tgCommandRun(inputParams);

  state.active = false;

  res.json(data);
};
