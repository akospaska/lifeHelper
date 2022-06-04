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
  const testUrl = '/api/forgotpasswordrequest'
  const testMethod = 'POST'

  const tableName = 'account'
  const testUserName = 'testUser@gail.com'

  const testPassword = 'pacal'

  let server

  beforeAll(async () => {
    await sqlInit()

    await mongoInit()
    await connectRabbitMq()
    await redisInIt()
    server = await serverInit()

    await prepareDbforTests()
    await knex(tableName).truncate()

    await knex(tableName).insert({
      email: testUserName,
      password: stringToSHA512(validatedWebProcessServerVariables.passwordSaltKey + testPassword),
      createdBy: 1,
      isAdmin: true,
      groupId: 1,
      isConfirmed: true,
    })
  })

  afterAll(async () => {
    await redisClose()
    await knex(tableName).truncate()
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
          email: testUserName,
        },
      }

      const res = await server.inject(injectOptions)

      const { isValid } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(200)
      expect(isValid).toEqual(true)
    })
  })
})
