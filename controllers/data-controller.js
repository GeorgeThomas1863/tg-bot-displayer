import { tgCommandRun } from "../src/src.js";
import state from "../src/util/state.js";

export const tgCommandControl = async (req, res) => {
  if (!req || !req.body) return res.status(400).json({ error: "Missing request body" });
  const inputParams = req.body;

  if (inputParams.command === "stop") {
    state.active = false;
    console.log("STOPPED EXECUTION");
    return res.json({ message: "STOPPED" });
  }

  state.active = true;

  try {
    const data = await tgCommandRun(inputParams);
    res.json(data);
  } catch (error) {
    console.log("TG COMMAND ERROR:", error);
    const message = error?.message || String(error);
    res.status(500).json({ error: message });
  } finally {
    state.active = false;
  }
};
