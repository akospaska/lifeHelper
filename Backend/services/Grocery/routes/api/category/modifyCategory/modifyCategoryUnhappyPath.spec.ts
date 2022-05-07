import { serverInit } from '../../../../server'

import { createNewCategory, prepareDbforTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('me  Endpoint test ', () => {
  const testUrl = '/api/category/modifycategory'
  const testMethod = 'POST'

  let server
  const testCategoryName = 'test category'
  const testCategoryPrioirty = 1
  const testCategoryGroupId = 1
  const testAccountId = 1
  let testCategoryId

  beforeAll(async () => {
    await sqlInit()
    server = await serverInit()
    await prepareDbforTests()
    testCategoryId = await createNewCategory(testCategoryName, testCategoryPrioirty, 1, 1)
  })

  afterAll(async () => {
    await server.stop()
    await sqlClose()
  })

  describe('UnHappy Path', () => {
    test('should return 403 when the requestBody contains a categoryId what belongs not to the accountId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          accountId: testAccountId,
          categoryId: 1,
          categoryDetails: {
            categoryName: testCategoryName,
            priority: testCategoryPrioirty,
            icon: 'i am the icon',
          },
        },
      }

      const expectedTestResponse = {
        code: 403,
        isValid: false,
        errorMessage: 'Permission Denied!',
        hashValue: null,
        error: null,
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { errorMessage } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedTestResponse.code)

      expect(errorMessage).toEqual(expectedTestResponse.errorMessage)
    })
    test('should return 400 when the requestBody doesn"t contains the accountId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          categoryId: 1,
          categoryDetails: {
            categoryName: testCategoryName,
            priority: testCategoryPrioirty,
            icon: 'i am the icon',
          },
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

      const { error, errorMessage } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedTestResponse.code)

      expect(errorMessage).toEqual(expectedTestResponse.errorMessage)
      expect(error.length > 0).toEqual(true)
    })
    test('should return 400 when the requestBody doesn"t contains the categoryId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          categoryId: 1,
          categoryDetails: {
            accountId: testAccountId,
            priority: testCategoryPrioirty,
            icon: 'i am the icon',
          },
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
          {
            message: '"categoryDetails.categoryName" is required',
            path: ['categoryDetails', 'categoryName'],
            type: 'any.required',
            context: { label: 'categoryDetails.categoryName', key: 'categoryName' },
          },
          {
            message: '"categoryDetails.accountId" is not allowed',
            path: ['categoryDetails', 'accountId'],
            type: 'object.unknown',
            context: { child: 'accountId', label: 'categoryDetails.accountId', value: 1, key: 'accountId' },
          },
        ],
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { error, errorMessage } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedTestResponse.code)

      expect(errorMessage).toEqual(expectedTestResponse.errorMessage)
      expect(error.length > 0).toEqual(true)
    })
  })
})
