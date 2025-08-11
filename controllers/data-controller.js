import { tgCommandRun } from "../src/tg-command.js";
import state from "../src/state.js";

export const tgCommandControl = async (req, res) => {
  const inputParams = req.body;

  if (inputParams.command === "stop") {
    state.active = false;
    return res.json({ message: "STOPPED" });
  }

  state.active = true;

  const data = await tgCommandRun(inputParams);

  state.active = false;

  res.json(data);
};
