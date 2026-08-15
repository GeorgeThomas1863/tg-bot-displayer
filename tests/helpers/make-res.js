// Shared fake Express `res` builder for tests — records status/json/setHeader/sendFile
// calls without needing a real HTTP server.

export const makeRes = () => {
  const res = {
    statusCode: 200,
    statusCalls: [],
    headers: {},
    jsonCalls: [],
    sendFileCalls: [],
  };
  res.setHeader = (name, value) => {
    res.headers[name] = value;
  };
  res.status = (code) => {
    res.statusCalls.push(code);
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.jsonCalls.push(body);
    return res;
  };
  res.sendFile = (filePath) => {
    res.sendFileCalls.push(filePath);
  };
  return res;
};
