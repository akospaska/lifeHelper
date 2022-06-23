import { serverInit } from '../../../../server'

import { prepareDbforTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('me  Endpoint test ', () => {
  const testUrl = '/api/groceryitem/deletegroceryitem'
  const testMethod = 'POST'

  const testAccountId = 1
  const testGroceryItemId = 5

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
    test('should return 403 and errorDetails when the request body contains a non existed groceryItemId or the accountId not belongs to the groceryItemId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: testAccountId, groceryItemId: 56465464 },
      }

      const expectedTestResponse = {
        code: 403,
        isValid: false,
        errorMessage: 'Invalid parameters',
        hashValue: null,
        error: null,
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage, error } = JSON.parse(res.payload)

      expect(isValid).toEqual(expectedTestResponse.isValid)
      expect(errorMessage).toEqual(expectedTestResponse.errorMessage)
      expect(error).toEqual(expectedTestResponse.error)
      expect(res.statusCode).toEqual(403)
    })

    test('should return 400 and errorDetails when the request body doesn"t contain an accountId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { groceryItemId: testGroceryItemId },
      }

      const expectedTestResponse = {
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

      const { isValid, errorMessage, error } = JSON.parse(res.payload)

      expect(isValid).toEqual(expectedTestResponse.isValid)
      expect(errorMessage).toEqual(expectedTestResponse.errorMessage)
      expect(error.length > 0).toEqual(true)
      expect(res.statusCode).toEqual(400)
    })

    test('should return 400 and errorDetails when the request body doesn"t contain a groceryItemId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: testAccountId },
      }

      const expectedTestResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        hashValue: null,
        error: [
          {
            message: '"groceryItemId" is required',
            path: ['groceryItemId'],
            type: 'any.required',
            context: { label: 'groceryItemId', key: 'groceryItemId' },
          },
        ],
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage, error } = JSON.parse(res.payload)

      expect(isValid).toEqual(expectedTestResponse.isValid)
      expect(errorMessage).toEqual(expectedTestResponse.errorMessage)
      expect(error.length > 0).toEqual(true)
      expect(res.statusCode).toEqual(400)
    })
  })
})
