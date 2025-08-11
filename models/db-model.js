//import mongo
import * as db from "../config/db.js";
import { ObjectId } from "mongodb";

//connect to db AGAIN here just to be safe
await db.dbConnect();

class dbModel {
  constructor(dataObject, collection) {
    this.dataObject = dataObject;
    this.collection = collection;
  }

  //STORE DATA
  async storeAnyData() {
    const storeVid = await db.dbGet().collection(this.collection).insertOne(this.dataObject);
    // console.log(storeVid);

    return storeVid;
  }

  async storeUniqueVid() {
    await this.vidAlreadyStored();

    const storeVid = await db.dbGet().collection(this.collection).insertOne(this.dataObject);
    return storeVid;
  }

  async vidAlreadyStored() {
    const { forwardFromChannelId, forwardFromMessageId } = this.dataObject;

    if (!forwardFromChannelId || !forwardFromMessageId) {
      console.log("CANNOT FIND UNIQUE IDENTIFIERS");
      return true;
    }

    const vidAlreadyStored = await db.dbGet().collection(this.collection).findOne({ forwardFromChannelId: forwardFromChannelId, forwardFromMessageId: forwardFromMessageId }); //prettier-ignore
    if (vidAlreadyStored) {
      const error = new Error("VID ALREADY STORED");
      throw error;
    }
  }
}

export default dbModel;
