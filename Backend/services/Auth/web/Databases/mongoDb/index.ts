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

  const db = client.db(dbName)

  const testMongoConnection = await db.collection(collectionName).find({}).limit(1).toArray()

  if (!testMongoConnection) {
    throw 'MongoDb connection error'
  }

  console.log('MongoDb Connected')

  //await db.collection(collectionName).remove({});
}

export const closeMongDbConnection = async () => {
  await client.close()
  console.log('mongoDb Connection has been closed')
}

export const insertNewSessionDetails = async (sessionDetails: sessionDetails) => {
  console.log(sessionDetails)
  const db = client.db(dbName)

  const { acknowledged }: mongoInsertResult = await db.collection(collectionName).insertOne(sessionDetails)

  if (!acknowledged) throw 'MongoInsertError'

  return
}

export const getSessiondetails = async (sessionKey: string) => {
  const db = client.db(dbName)

  const mongoResponseData: sessionDetails[] = await db
    .collection(collectionName)
    .find({ sessionKey: sessionKey })
    .toArray()

  return mongoResponseData[0]
}

export const dropSessionCollection = async () => {
  const db = client.db(dbName)

  await db.collection(collectionName).remove({})
}

module.exports = {
  mongoInit,
  closeMongDbConnection,
  dropSessionCollection,
  insertNewSessionDetails,
  getSessiondetails,
}

interface sessionDetails {
  accountId: number
  isAdmin: boolean
  groupId: number
  sessionKey: string
}

interface mongoInsertResult {
  acknowledged: true
}
