import { MongoClient, ServerApiVersion } from "mongodb";
import config from "../config";
import IToken from "../Interfaces/IToken";
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
  dbClient.close();
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

/**
 * @summary Fetches the specified upload from the database
 * @param upload The atleast partial of an upload to get from the database
 * @returns <IUpload> The upload from the database
 */
export async function getUpload(upload: Partial<IUpload>): Promise<IUpload> {
  const dbConnection = await dbClient.connect();
  const collection = dbConnection
    .db(config.database.name)
    .collection("uploads");
  const result = await collection.findOne(upload);
  dbConnection.close();
  if (result && "uploadId" in result) {
    return Promise.resolve(result as unknown as IUpload);
  } else {
    return Promise.reject("NO_UPLOAD_FOUND");
  }
}

/**
 * @summary Deletes the specified upload from the database
 * @param upload The atleast partial of an upload to delete from the database
 */
export async function deleteUpload(upload: Partial<IUpload>): Promise<void> {
  const dbConnection = await dbClient.connect();
  const collection = dbConnection
    .db(config.database.name)
    .collection("uploads");
  await collection.deleteOne(upload);
  dbConnection.close();
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

export async function getNextUserId(): Promise<number> {
  const dbConnection = await dbClient.connect();
  const collection = dbConnection
    .db(config.database.name)
    .collection("users");
  const result = await collection
    .find({})
    .sort({ userId: -1 })
    .limit(1)
    .toArray();
  dbConnection.close();
  if (result.length === 0) {
    return Promise.resolve(1);
  } else {
    return Promise.resolve(result[0].userId + 1);
  }
}

/**
 * @summary Inserts a token into the database
 * @param user The user to create the token for
 * @param expires The expiration date of the token
 * @returns 
 */
export async function createInviteToken(user: IUser, expires: Date): Promise<IToken> {
  const dbConnection = await dbClient.connect();
  const collection = dbConnection
    .db(config.database.name)
    .collection("inviteTokens");
  const token = {
    token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    createdOn: new Date(),
    createdBy: user,
    expiresOn: expires,
    isActive: true,
  };
  await collection.insertOne(token);
  dbConnection.close();
  return Promise.resolve(token);
}

/**
 * @summary Updates a token in the database
 * @param token The token to modify
 * @param newToken The modified and update token
 */
export async function modifyInviteToken(token: IToken, newToken: IToken): Promise<void> {
  const dbConnection = await dbClient.connect();
  const collection = dbConnection
    .db(config.database.name)
    .collection("inviteTokens");
  await collection.updateOne(token, newToken);
  dbConnection.close();
};

/**
 * @summary Deletes a token from the database entirely
 * @param token The token to delete from the database
 */
export async function deleteInviteToken(token: IToken): Promise<void> {
  const dbConnection = await dbClient.connect();
  const collection = dbConnection
    .db(config.database.name)
    .collection("inviteTokens");
  await collection.deleteOne(token);
  dbConnection.close();
}

/**
 * @summary Fetches the invite token based on the token string
 * @param tokenActual The invite token to get from the database
 * @returns 
 */
export async function getInviteToken(tokenActual: string): Promise<IToken> {
  const dbConnection = await dbClient.connect();
  const collection = dbConnection
    .db(config.database.name)
    .collection("inviteTokens");
  const result = await collection.findOne({ token: tokenActual });
  dbConnection.close();
  if (result && "token" in result) {
    return Promise.resolve(result as unknown as IToken);
  } else {
    return Promise.reject("NO_TOKEN_FOUND");
  }
}