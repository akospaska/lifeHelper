import { serverInit } from '../../../server'

import { insertNewConfirmationToken, knex, prepareDbforTests, sqlClose, sqlInit } from '../../../Databases/sql'
import { generateRandomHashValue, stringToSHA512 } from '../../../tools/encryption'
import { closeMongDbConnection, mongoInit } from '../../../Databases/mongoDb'
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
    test('should return 400 and error details when the token"s format is invalid', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          token: 'iamtheshorttoken',
        },
      }

      const expectedResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        hashValue: null,
        error: [
          {
            message: '"token" length must be 128 characters long',
            path: ['token'],
            type: 'string.length',
            context: { limit: 128, value: 'iamtheshorttoken', label: 'token', key: 'token' },
          },
        ],
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage, error } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedResponse.code)
      expect(isValid).toEqual(false)
      expect(errorMessage).toContain('Validation')
      expect(error.length > 0).toEqual(true)
    })

    test('should return 400 and error details when the request body doesn"t contain a token property', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          invalidProperty: testToken,
        },
      }

      const expectedResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        hashValue: null,
        error: [
          {
            message: '"token" is required',
            path: ['token'],
            type: 'any.required',
            context: { label: 'token', key: 'token' },
          },
          {
            message: '"invalidProperty" is not allowed',
            path: ['invalidProperty'],
            type: 'object.unknown',
            context: {
              child: 'invalidProperty',
              label: 'invalidProperty',
              value:
                'a8bd84fcf763d1210ef051e277e2e41f1eaf1188d01869c8f381be28c81e785afe205533ee402332bf19dc5ea76ad8ec6fb686127315ba4ce4ea65aecc9b1895',
              key: 'invalidProperty',
            },
          },
        ],
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage, error } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedResponse.code)
      expect(isValid).toEqual(false)
      expect(errorMessage).toContain('Validation')
      expect(error.length > 0).toEqual(true)
    })

    test('should return 403 and error details when the token"s format is invalid', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          token: generateRandomHashValue(),
        },
      }

      const expectedResponse = {
        code: 403,
        isValid: false,
        errorMessage: 'Token not found or expired',
        hashValue: null,
        error: null,
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage, error } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedResponse.code)
      expect(isValid).toEqual(false)
      expect(errorMessage).toContain('expired')
      expect(error).toEqual(null)
    })
  })
})
