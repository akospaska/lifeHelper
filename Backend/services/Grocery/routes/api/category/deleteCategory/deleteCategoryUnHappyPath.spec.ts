import { serverInit } from '../../../../server'

import { createNewCategory, prepareDbforTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('me  Endpoint test ', () => {
  const testUrl = '/api/category/deletecategory'
  const testMethod = 'POST'

  let server
  const testCategoryName = 'test category'
  const testCategoryPrioirty = 1
  const testAccountId = 1
  let testCategoryId

  beforeAll(async () => {
    await sqlInit()
    server = await serverInit()
    await prepareDbforTests()
    testCategoryId = await createNewCategory(testCategoryName, testCategoryPrioirty, 1, 1, 'icon')
  })

  afterAll(async () => {
    await server.stop()
    await sqlClose()
  })

  describe('Happy Path', () => {
    test('should return 403 when the category doesn"t belongs to the accountId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 11, categoryId: testCategoryId },
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

      const { errorMessage, isValid } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedTestResponse.code)
      expect(isValid).toEqual(expectedTestResponse.isValid)

      expect(errorMessage).toEqual(expectedTestResponse.errorMessage)
    })
    test('should return 400 when the request body doesn"t contain the accountId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { categoryId: testCategoryId },
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

      const { errorMessage, isValid, error } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedTestResponse.code)
      expect(isValid).toEqual(expectedTestResponse.isValid)

      expect(errorMessage).toEqual(expectedTestResponse.errorMessage)
      expect(error.length > 0).toEqual(true)
    })

    test('should return 400 when the request body doesn"t contain the categoryId', async () => {
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
            message: '"categoryId" is required',
            path: ['categoryId'],
            type: 'any.required',
            context: { label: 'categoryId', key: 'categoryId' },
          },
        ],
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { errorMessage, isValid, error } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedTestResponse.code)
      expect(isValid).toEqual(expectedTestResponse.isValid)

      expect(errorMessage).toEqual(expectedTestResponse.errorMessage)
      expect(error.length > 0).toEqual(true)
    })
  })
})
