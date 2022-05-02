import { serverInit } from '../../../../server'

import {
  categorySqlResult,
  groupConnectSqlResult,
  knex,
  prepareDbforTests,
  sqlClose,
  sqlInit,
} from '../../../../databases/sql'
import { errorResponseBody } from '../../../../utils/errorHandling'

describe('me  Endpoint test ', () => {
  const testUrl = '/api/category/getcategorieswithitems'
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
    test('should return 400 and error details when the groupId is missing from the request body', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 1 },
      }

      const expectedTestResponse = {
        code: 400,
        errorMessage: 'Request body validation error',
        error: [
          {
            message: '"groupId" is required',
            path: ['groupId'],
            type: 'any.required',
            context: { label: 'groupId', key: 'groupId' },
          },
        ],
      }

      const res = await server.inject(injectOptions)

      const testResponse: errorResponseBody = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)

      expect(expectedTestResponse).toEqual(testResponse)
    })
    test('should return 400 and error details when the accountId is missing from the request body', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { groupId: 1 },
      }

      const expectedTestResponse = {
        code: 400,
        errorMessage: 'Request body validation error',
        error: [
          {
            message: '"accountId" is required',
            path: ['accountId'],
            type: 'any.required',
            context: { label: 'accountId', key: 'accountId' },
          },
        ],
      }

      const res = await server.inject(injectOptions)

      const testResponse: errorResponseBody = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)

      expect(expectedTestResponse).toEqual(testResponse)
    })
  })
})
