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
import { redisClose, redisInIt } from '../../../Databases/redis'

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

    await insertNewSessionDetails(testSessionInsertDetails)
  })

  afterAll(async () => {
    await knex(tableName).truncate()
    await server.stop()
    await redisClose()
    await sqlClose()
    await closeMongDbConnection()
  })

  describe('UnHappy Path', () => {
    test('should return 400 and error details when the sessionKey is missing', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {},
      }

      const expectedErrorDetails = [
        {
          message: '"sessionKey" is required',
          path: ['sessionKey'],
          type: 'any.required',
          context: {
            label: 'sessionKey',
            key: 'sessionKey',
          },
        },
      ]

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage, error } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(isValid).toEqual(false)
      expect(errorMessage).toEqual('RequestBody Validation Failed')
      expect(error).toEqual(expectedErrorDetails)
    })

    test('should return 400 and error details when the sessionKey s length is not exactly 128 characters long', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          sessionKey: 'iAmTheShortSessionKey',
        },
      }

      const expectedErrorDetails = [
        {
          message: '"sessionKey" length must be 128 characters long',
          path: ['sessionKey'],
          type: 'string.length',
          context: {
            limit: 128,
            value: 'iAmTheShortSessionKey',
            label: 'sessionKey',
            key: 'sessionKey',
          },
        },
      ]
      const res = await server.inject(injectOptions)

      const { errorMessage, error } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(errorMessage).toEqual('RequestBody Validation Failed')
      expect(error).toEqual(expectedErrorDetails)
    })
  })
})
