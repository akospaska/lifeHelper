import { serverInit } from '../../../../server'

import { groupConnectSqlResult, knex, prepareDbforTests, sqlClose, sqlInit } from '../../../../databases/sql'
import { errorResponseBody } from '../../../../utils/errorHandling'

describe('me  Endpoint test ', () => {
  const testUrl = '/api/group/getgroups'
  const testMethod = 'POST'

  let server

  beforeAll(async () => {
    await sqlInit()
    server = await serverInit()
    await prepareDbforTests()
  })

  afterAll(async () => {
    await server.stop()
    await sqlClose()
  })

  describe('Happy Path', () => {
    test('should return 400 and error details when the requestBody is just an empty object', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {},
      }

      const expectedTestResult = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        hashValue: null,
        error: [
          {
            message: '"accountId" is required',
            path: ['accountId'],
            type: 'any.required',
            context: { label: 'accountId', key: 'accountId' },
          },
        ],
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const testResponse: errorResponseBody = JSON.parse(res.payload)

      console.log(res.payload)

      expect(expectedTestResult.errorMessage).toEqual(testResponse.errorMessage)
      expect(res.statusCode).toEqual(400)
    })

    test('should return 400 and error details when the requestBody contains invalid object property', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 1, IamTheInvalidProperty: false },
      }

      const expectedTestResult = {
        code: 400,
        errorMessage: 'RequestBody Validation Failed',
        error: [
          {
            message: '"IamTheInvalidProperty" is not allowed',
            path: ['IamTheInvalidProperty'],
            type: 'object.unknown',
            context: {
              child: 'IamTheInvalidProperty',
              label: 'IamTheInvalidProperty',
              value: false,
              key: 'IamTheInvalidProperty',
            },
          },
        ],
      }

      const res = await server.inject(injectOptions)

      const testResponse: errorResponseBody = JSON.parse(res.payload)

      console.log(res.payload)

      expect(expectedTestResult.errorMessage).toEqual(testResponse.errorMessage)
      expect(res.statusCode).toEqual(400)
    })
  })
})
