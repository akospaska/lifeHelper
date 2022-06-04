import { serverInit } from '../../../server'

import { insertNewForgotPasswordToken, knex, prepareDbforTests, sqlClose, sqlInit } from '../../../Databases/sql'
import { generateRandomHashValue, stringToSHA512 } from '../../../tools/encryption'
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
  const testUrl = '/api/changepasswordafterforgotpasswordrequest'
  const testMethod = 'POST'

  const tableName = 'account'
  const testUserName = 'testUser@gail.com'

  const testPassword = 'pacal'

  const testToken = generateRandomHashValue()

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

    await insertNewForgotPasswordToken(1, testToken)
  })

  afterAll(async () => {
    await knex(tableName).truncate()
    await server.stop()
    await sqlClose()
    await closeMongDbConnection()
    await redisClose()
  })

  describe('Happy Path', () => {
    test('should return 200 when the request body contains a valid active account emaila ddress', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          emailAddress: 'testUser@gail.com',
          password: 'pacal',
          passwordAgain: 'pacal',
          forgotPasswordToken: testToken,
        },
      }

      const res = await server.inject(injectOptions)

      const { isValid } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(200)
      expect(isValid).toEqual(true)
    })
  })
})
