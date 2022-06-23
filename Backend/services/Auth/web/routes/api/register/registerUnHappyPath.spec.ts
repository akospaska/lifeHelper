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

  const testUrl = '/api/register'
  const testMethod = 'POST'

  let server

  beforeAll(async () => {
    await sqlInit()

    await mongoInit()
    await connectRabbitMq()
    await redisInIt()
    server = await serverInit()

    await prepareDbforTests()
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
    test('should return 400 and error details when the email contains invalid email format', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          emailAddress: 'invalidemailformat',
          password: testPassword,
          creatorAccountId: 1,
          isAdmin: false,
        },
      }

      const expectedResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        hashValue: null,
        error: [
          {
            message: '"emailAddress" must be a valid email',
            path: ['emailAddress'],
            type: 'string.email',
            context: {
              value: 'invalidemailformat',
              invalids: ['invalidemailformat'],
              label: 'emailAddress',
              key: 'emailAddress',
            },
          },
        ],
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage, error } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(isValid).toEqual(expectedResponse.isValid)
      expect(error.length > 0).toEqual(true)
      expect(errorMessage).toContain('Validation')
    })

    test('should return 400 and error details when the password is too short', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          emailAddress: testUserName,
          password: 'p',
          creatorAccountId: 1,
          isAdmin: false,
        },
      }

      const expectedResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        hashValue: null,
        error: [
          {
            message: '"password" length must be at least 3 characters long',
            path: ['password'],
            type: 'string.min',
            context: { limit: 3, value: 'p', label: 'password', key: 'password' },
          },
        ],
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage, error } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(isValid).toEqual(expectedResponse.isValid)
      expect(error.length > 0).toEqual(true)
      expect(errorMessage).toContain('Validation')
    })

    test('should return 403 and error details when the password is too short', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          emailAddress: 'test@gmail.com',
          password: testPassword,
          creatorAccountId: 2,
          isAdmin: true,
        },
      }

      const expectedResponse = {
        code: 403,
        isValid: false,
        errorMessage: 'Permission denied!',
        hashValue: null,
        error: null,
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(403)
      expect(isValid).toEqual(expectedResponse.isValid)
      expect(errorMessage).toContain('Permission')
    })
  })
})
