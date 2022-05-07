import { serverInit } from '../../../../server'

import { prepareDbforTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('me  Endpoint test ', () => {
  const testUrl = '/api/groceryitem/creategroceryitem'
  const testMethod = 'POST'

  const testAccountId = 1
  const testGroupId = 1
  const testCategoryId = 2
  const testGroceryItemName = 'I am the testgroup'

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
    test('should return 403 and error details when the accountId doesn"t belong to the groupId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          accountId: testAccountId,
          groupId: 23343,
          categoryId: testCategoryId,
          groceryItemName: testGroceryItemName,
        },
      }

      const expectedTestResponse = {
        code: 403,
        isValid: false,
        errorMessage: 'Permission Denied',
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

    test('should return 403 and error details when the accountId doesn"t belong to the categoryId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          accountId: testAccountId,
          groupId: testGroupId,
          categoryId: 231231,
          groceryItemName: testGroceryItemName,
        },
      }

      const expectedTestResponse = {
        code: 403,
        isValid: false,
        errorMessage: 'Permission Denied',
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

    test('should return 400 and error details when the request body doesn"t contain an accountId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          groupId: testGroupId,
          categoryId: 231231,
          groceryItemName: testGroceryItemName,
        },
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

    test('should return 400 and error details when the request body doesn"t contain an groupId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          accountId: testAccountId,
          categoryId: 231231,
          groceryItemName: testGroceryItemName,
        },
      }

      const expectedTestResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        hashValue: null,
        error: [
          {
            message: '"groupId" is required',
            path: ['groupId'],
            type: 'any.required',
            context: { label: 'groupId', key: 'groupId' },
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

    test('should return 400 and error details when the request body doesn"t contain a categoryId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          accountId: testAccountId,
          groupId: testGroupId,
          groceryItemName: testGroceryItemName,
        },
      }

      const expectedTestResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        hashValue: null,
        error: [
          {
            message: '"categoryId" is required',
            path: ['categoryId'],
            type: 'any.required',
            context: { label: 'categoryId', key: 'categoryId' },
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

    test('should return 400 and error details when the request body doesn"t contain a groceryItemName', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          accountId: testAccountId,
          groupId: testGroupId,
          categoryId: 231231,
        },
      }

      const expectedTestResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        hashValue: null,
        error: [
          {
            message: '"groceryItemName" is required',
            path: ['groceryItemName'],
            type: 'any.required',
            context: { label: 'groceryItemName', key: 'groceryItemName' },
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
