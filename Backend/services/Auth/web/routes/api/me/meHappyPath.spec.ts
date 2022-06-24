import { serverInit } from '../../../server'

import { knex, prepareDbforTests, sqlClose, sqlInit } from '../../../Databases/sql'
import { stringToSHA512 } from '../../../tools/encryption'
import { validatedWebProcessServerVariables } from '../../../validation/server'
import {
  closeMongDbConnection,
  dropSessionCollection,
  insertNewSessionDetails,
  mongoInit,
} from '../../../Databases/mongoDb'
import { closeRabbitMqConnection, connectRabbitMq } from '../../../rabbitMq'
import { insertNewSession, redisClose, redisInIt } from '../../../Databases/redis'

describe('me  Endpoint test ', () => {
  const tableName = 'account'
  const testUserName = 'TestUser@gmail.com'

  const testPassword = 'testPassword!'

  const testUrl = '/api/me'
  const testMethod = 'POST'

  let server

  const testSessionKey =
    'f4435d0c749fcd78191a612f927c80b19aca69afe1a0e5d22c8b48f691da4ea7a7c59cc4c8f3e0d44341297cd95e709f482a3d5b69bf0a40de7293950d7028d7'

  const testSessionInsertDetails = {
    accountId: 1,
    isAdmin: true,
    groupId: 1,
    sessionKey: testSessionKey,
  }
  beforeAll(async () => {
    await sqlInit()

    await mongoInit()
    await connectRabbitMq()
    await redisInIt()
    server = await serverInit()

    await prepareDbforTests()

    await knex(tableName).truncate()

    //Insert the test record
    await knex(tableName).insert({
      email: testUserName,
      password: stringToSHA512(validatedWebProcessServerVariables.passwordSaltKey + testPassword),
      createdBy: 1,
      isAdmin: true,
      groupId: 1,
    })

    await insertNewSession(testSessionInsertDetails)
  })

  afterAll(async () => {
    await knex(tableName).truncate()
    await server.stop()
    await redisClose()
    await sqlClose()
    await closeRabbitMqConnection()
    await closeMongDbConnection()
  })

  describe('Happy Path', () => {
    test('should return 200 when the sessionKey is valid and already stored into the database', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          sessionKey: testSessionKey,
        },
      }

      const res = await server.inject(injectOptions)

      const { accountId, groupId, sessionKey } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(200)
      expect(accountId).toEqual(1)
      expect(groupId).toEqual(1)
      expect(sessionKey).toHaveLength(128) //sha512 hash's length is 128*/
    })
  })
})
