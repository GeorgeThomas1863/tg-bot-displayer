export const tgCommandParse = async (req, res) => {
  const { command } = req.body;
  //   console.log(command);
  res.json({ command: "build" });
};
