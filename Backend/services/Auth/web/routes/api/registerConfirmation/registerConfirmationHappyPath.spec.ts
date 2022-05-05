import { serverInit } from '../../../server'

import { insertNewConfirmationToken, knex, prepareDbforTests, sqlClose, sqlInit } from '../../../Databases/sql'
import { generateRandomHashValue, stringToSHA512 } from '../../../tools/encryption'
import { validatedWebProcessServerVariables } from '../../../validation/server'
import {
  closeMongDbConnection,
  dropSessionCollection,
  insertNewSessionDetails,
  mongoInit,
} from '../../../Databases/mongoDb'
import { closeRabbitMqConnection, connectRabbitMq } from '../../../rabbitMq'

describe('me  Endpoint test ', () => {
  const testUrl = '/api/registerconfirmation'
  const testMethod = 'POST'

  const testToken = generateRandomHashValue()

  let server

  beforeAll(async () => {
    await sqlInit()

    await mongoInit()
    await connectRabbitMq()
    server = await serverInit()

    await prepareDbforTests()
    await insertNewConfirmationToken(1, testToken)
  })

  afterAll(async () => {
    await server.stop()
    await sqlClose()
    await closeMongDbConnection()
    await closeRabbitMqConnection()
  })

  describe('Happy Path', () => {
    test('should return 200 when the request body contains a valid active account emaila ddress', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          token: testToken,
        },
      }

      const res = await server.inject(injectOptions)

      const { isValid } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(200)
      expect(isValid).toEqual(true)
    })
  })
})
