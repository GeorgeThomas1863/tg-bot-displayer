export const tgCommandParse = async (req, res) => {
  const inputParams = req.body;

  console.log("!!!INPUT PARAMS");
  console.dir(inputParams);

  //   console.log(command);
  res.json({ command: "build" });
};
