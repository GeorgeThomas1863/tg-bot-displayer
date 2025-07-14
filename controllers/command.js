import { tgCommandRun } from "../src/main.js";

export const tgCommandControl = async (req, res) => {
  const inputParams = req.body;

  const data = await tgCommandRun(inputParams);
  res.json(data);
};
