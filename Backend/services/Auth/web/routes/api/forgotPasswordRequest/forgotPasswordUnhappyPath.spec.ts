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
    await redisInIt()
    await connectRabbitMq()
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
    await knex(tableName).truncate()
    await server.stop()
    await redisClose()
    await sqlClose()
    await closeRabbitMqConnection()
    await closeMongDbConnection()
  })

  describe('Happy Path', () => {
    test('should return 400 and error details when the request body contains invalid object property', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          emaddil: testUserName,
        },
      }

      const expectedErrorResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        hashValue: null,
        error: [
          {
            message: '"email" is required',
            path: ['email'],
            type: 'any.required',
            context: { label: 'email', key: 'email' },
          },
          {
            message: '"emaddil" is not allowed',
            path: ['emaddil'],
            type: 'object.unknown',
            context: { child: 'emaddil', label: 'emaddil', value: 'testUser@gail.com', key: 'emaddil' },
          },
        ],
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, error } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(isValid).toEqual(false)
      expect(error.length > 0).toEqual(true)
    })

    test('should return 403 and error details when the request body contains a not active email address', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          email: 'iamthenotvalidemailaddress@gmail.com',
        },
      }

      const expectedErrorResponse = {
        code: 403,
        isValid: false,
        errorMessage: 'Invalid email address',
        hashValue: null,
        error: null,
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(403)
      expect(isValid).toEqual(false)
      expect(errorMessage).toContain('email')
    })

    test('should return 403 and error details when the request body contains a not valid email address format', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          email: 'iamthenotvalidemailaddressgmail.com',
        },
      }

      const expectedErrorResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        hashValue: null,
        error: [
          {
            message: '"email" must be a valid email',
            path: ['email'],
            type: 'string.email',
            context: {
              value: 'iamthenotvalidemailaddressgmail.com',
              invalids: ['iamthenotvalidemailaddressgmail.com'],
              label: 'email',
              key: 'email',
            },
          },
        ],
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage, error } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(isValid).toEqual(false)
      expect(errorMessage).toContain('Validation')
      expect(error.length > 0).toEqual(true)
    })
  })
})
