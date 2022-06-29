import { MongoClient, ServerApiVersion } from "mongodb";
import config from "../config";
import IUpload from "../Interfaces/IUpload";
import IUser from "../Interfaces/IUser";
const dbClient = new MongoClient(
  "mongodb+srv://" +
    config.database.user +
    ":" +
    config.database.password +
    "@" +
    config.database.host,
  { retryWrites: true, w: "majority", serverApi: ServerApiVersion.v1 }
);

/**
 * @summary Inserts a user into the database.
 * @param user The user to insert into the database
 * @returns
 */
export async function insertUser(user: IUser): Promise<IUser> {
  const dbConnection = await dbClient.connect();
  const collection = dbConnection.db(config.database.name).collection("users");
  await collection.insertOne(user);
  dbConnection.close();
  return Promise.resolve(user);
}

/**
 * @summary Deletes a user from the database.
 * @param user The user to delete from the database
 * @returns
 */
export async function deleteUser(user: Partial<IUser>): Promise<void> {
  const dbConnection = await dbClient.connect();
  const collection = dbConnection.db(config.database.name).collection("users");
  await collection.deleteOne(user);
  dbConnection.close();
}

/**
 * @summary Updates a user on the database.
 * @param user The user to update on the database
 * @param updatedUser The updated user
 * @returns
 */
export async function modifyUser(
  user: Partial<IUser>,
  updatedUser: Partial<IUser>
): Promise<void> {
  const dbConnection = await dbClient.connect();
  const collection = dbConnection.db(config.database.name).collection("users");
  await collection.updateOne(user, updatedUser);
  dbConnection.close();
  return Promise.resolve();
}

/**
 * @summary Gets a user from the database.
 * @param user The user to get from the database
 * @returns
 */
export async function getUser(user: Partial<IUser>): Promise<IUser> {
  const dbConnection = await dbClient.connect();
  const collection = dbConnection.db(config.database.name).collection("users");
  const result = await collection.findOne(user);
  dbConnection.close();
  if (result && "id" in result) {
    return Promise.resolve(result as unknown as IUser);
  } else {
    return Promise.reject("User not found");
  }
}
/**
 * @summary Inserts an upload into the database
 * @param upload The upload to insert into the database
 * @returns
 */
export async function insertUpload(upload: IUpload): Promise<IUpload> {
  const dbConnection = await dbClient.connect();
  const collection = dbConnection
    .db(config.database.name)
    .collection("uploads");
  await collection.insertOne(upload);
  dbConnection.close();
  return Promise.resolve(upload);
}

/**
 * @summary Updates an upload in the database
 * @param upload The upload to update on the database
 * @param updatedUpload The updated upload
 * @returns
 */
export async function modfyUpload(
  upload: Partial<IUpload>,
  updatedUpload: Partial<IUpload>
): Promise<void> {
  const dbConnection = await dbClient.connect();
  const collection = dbConnection
    .db(config.database.name)
    .collection("uploads");
  await collection.updateOne(upload, updatedUpload);
  dbConnection.close();
  return Promise.resolve();
}

export async function getNextUploadId(): Promise<number> {
  const dbConnection = await dbClient.connect();
  const collection = dbConnection
    .db(config.database.name)
    .collection("uploads");
  const result = await collection
    .find({})
    .sort({ uploadId: -1 })
    .limit(1)
    .toArray();
  dbConnection.close();
  if (result.length === 0) {
    return Promise.resolve(1);
  } else {
    return Promise.resolve(result[0].uploadId + 1);
  }
}
