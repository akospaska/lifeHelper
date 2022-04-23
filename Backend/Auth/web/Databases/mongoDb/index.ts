const { MongoClient, ObjectId } = require('mongodb')

import { validatedMongoDbEnvironmentVariables } from '../../validation/server/index'

let client

const { mongoDbHost, mongoDbPort } = validatedMongoDbEnvironmentVariables

const dbName = 'authMongoDb'

const collectionName = 'session'

console.log(`mongodb://${mongoDbHost}:${mongoDbPort}/${dbName}`)

export const mongoInit = async () => {
  const url = `mongodb://${mongoDbHost}:${mongoDbPort}/${dbName}`
  client = new MongoClient(url)
  await client.connect()
  console.log('MONGODB connected')
  const db = client.db(dbName)

  await db.collection(collectionName).find({}).limit(1).toArray()

  //await db.collection(collectionName).remove({});
}

export const closeMongDbConnection = async () => {
  await client.close()
}

const getToDo = async () => {
  const db = client.db(dbName)
  const mongoResponseData = await db.collection(collectionName).find({}).toArray()
  return mongoResponseData.map((element) => {
    return { id: element.id, name: element.name }
  })
}

export const createPrintLabelsLogMongo = async (
  logId: number,
  successfull: boolean,
  pdfCreated: boolean,
  glsResponseBody: any,
  glsrequestBody: any
) => {
  const db = client.db(dbName)
  const insertResult: { acknowledged: boolean } = await db.collection(collectionName).insertOne({
    logId: logId,
    successfull: successfull,
    pdfCreated: pdfCreated,
    glsResponseBody: glsResponseBody.response,
    glsRequestBody: glsResponseBody.request,
  })

  return insertResult.acknowledged
}

export const getLabelFromMongoDb = async (logId: number) => {
  const db = client.db(dbName)

  const mongoResponseData = await db.collection(collectionName).find({ logId: logId }).toArray()

  return mongoResponseData[0].glsResponseBody.Labels
}

export const getLogFileFromMongoDb = async (logId: number) => {
  const db = client.db(dbName)

  const mongoResponseData = await db.collection(collectionName).find({ logId: logId }).toArray()

  console.log(mongoResponseData)

  return mongoResponseData[0]
}

module.exports = {
  mongoInit,
  closeMongDbConnection,
  createPrintLabelsLogMongo,
  getLabelFromMongoDb,
  getLogFileFromMongoDb /* removeToDo, quit */,
}

/* const removeToDo = async (id) => {
  const db = client.db(dbName);

  const deleteResult = await db.collection(collectionName).deleteOne({ _id: ObjectId(id) });

  const toDoData = await getToDo();

  const isRemoveWasSucces = deleteResult.deletedCount > 0 ? 1 : 0;

  return { status: isRemoveWasSucces, data: toDoData };
};

const quit = async () => {
  await client.db.close();
}; */
