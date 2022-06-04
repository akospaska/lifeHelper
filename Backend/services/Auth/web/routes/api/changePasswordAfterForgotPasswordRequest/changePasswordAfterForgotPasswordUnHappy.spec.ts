import { serverInit } from '../../../server'

import { insertNewForgotPasswordToken, knex, prepareDbforTests, sqlClose, sqlInit } from '../../../Databases/sql'
import { generateRandomHashValue, stringToSHA512 } from '../../../tools/encryption'
import { validatedWebProcessServerVariables } from '../../../validation/server'
import { closeMongDbConnection, mongoInit } from '../../../Databases/mongoDb'
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

  describe('UnHappy Path', () => {
    test('should return 400 and error details when the two passwords are not the same', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          emailAddress: 'testUser@gail.com',
          password: 'pacal',
          passwordAgain: 'differentPassword',
          forgotPasswordToken: testToken,
        },
      }

      const expectedResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        hashValue: null,
        error: [
          {
            message: '"passwordAgain" must be [ref:password]',
            path: ['passwordAgain'],
            type: 'any.only',
            context: {
              valids: [
                {
                  adjust: null,
                  in: false,
                  iterables: null,
                  map: null,
                  separator: '.',
                  type: 'value',
                  ancestor: 1,
                  path: ['password'],
                  depth: 1,
                  key: 'password',
                  root: 'password',
                  display: 'ref:password',
                },
              ],
              label: 'passwordAgain',
              value: 'differentPassword',
              key: 'passwordAgain',
            },
          },
        ],
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, error, errorMessage } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedResponse.code)
      expect(isValid).toEqual(expectedResponse.isValid)
      expect(errorMessage).toEqual(expectedResponse.errorMessage)
      expect(error.length > 0).toEqual(true)
    })

    test('should return 403 and error details when the token is not an already inserted token', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          emailAddress: 'testUser@gail.com',
          password: 'pacal',
          passwordAgain: 'pacal',
          forgotPasswordToken: generateRandomHashValue(),
        },
      }

      const expectedResponse = {
        code: 403,
        isValid: false,
        errorMessage: 'Token is expired or not valid',
        hashValue: null,
        error: null,
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedResponse.code)
      expect(isValid).toEqual(false)
    })

    test('should return 403 and error details when the email address is not exists in the db', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          emailAddress: 'anotherTestUser@gail.com',
          password: 'pacal',
          passwordAgain: 'pacal',
          forgotPasswordToken: testToken,
        },
      }

      const expectedResponse = {
        code: 403,
        isValid: false,
        errorMessage: 'Invalid email address',
        hashValue: null,
        error: null,
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedResponse.code)
      expect(isValid).toEqual(false)
    })

    test('should return 400 and error details when the email is not a valid email . for exmaple missing @', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          emailAddress: 'anotherTestUsergail.com',
          password: 'pacal',
          passwordAgain: 'pacal',
          forgotPasswordToken: testToken,
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
              value: 'anotherTestUsergail.com',
              invalids: ['anotherTestUsergail.com'],
              label: 'emailAddress',
              key: 'emailAddress',
            },
          },
        ],
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, error } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedResponse.code)
      expect(isValid).toEqual(expectedResponse.isValid)

      expect(error.length > 0).toEqual(true)
    })
  })
})
