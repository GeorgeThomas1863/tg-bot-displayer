import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { MongoClient } from "mongodb";

let client;

export const dbConnect = async () => {
  //connect once only (db-model.js calls this at import)
  if (client) return;

  //connect to mongo server
  client = await MongoClient.connect(process.env.MONGO_URI);
};

//create function to call database outside file
export const dbGet = (dbName) => {
  //ensure db connection is working
  if (!client) {
    throw { message: "Database connection fucked" };
  }

  const name = checkDbName(dbName);

  //shares the client's connection pool
  return client.db(name);
};

//resolve the db name (arg, then DB_NAME, then "tg") and throw if invalid; returns the resolved name
export const checkDbName = (dbName) => {
  const name = dbName || process.env.DB_NAME || "tg";
  if (!isValidDbName(name)) {
    throw new Error(`Invalid database name: "${name}"`);
  }

  return name;
};

//mongo db name rules: non-empty, under 64 bytes, no forbidden chars
const FORBIDDEN_DB_CHARS = [" ", "/", "\\", ".", '"', "$", "*", "<", ">", ":", "|", "?", "\0"];

const isValidDbName = (name) => {
  if (typeof name !== "string" || !name) return false;
  if (Buffer.byteLength(name) >= 64) return false;

  for (const char of FORBIDDEN_DB_CHARS) {
    if (name.includes(char)) return false;
  }
  return true;
};
