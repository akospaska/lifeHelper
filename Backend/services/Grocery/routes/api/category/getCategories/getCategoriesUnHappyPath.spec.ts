import { serverInit } from '../../../../server'

import { createNewCategory, prepareDbforTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('me  Endpoint test ', () => {
  const testUrl = '/api/category/getcategories'
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
    testCategoryId = await createNewCategory(testCategoryName, testCategoryPrioirty, 1, 1, 'icon')
  })

  afterAll(async () => {
    await server.stop()
    await sqlClose()
  })

  describe('UnHappy Path', () => {
    test('should return 400 when the requestBody doesn"t contain accountId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { groupId: testCategoryGroupId },
      }

      const expectedResponse = {
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

      expect(res.statusCode).toEqual(expectedResponse.code)

      expect(error.length > 0).toEqual(true)

      expect(errorMessage).toEqual(expectedResponse.errorMessage)

      expect(isValid).toEqual(expectedResponse.isValid)
    })

    test('should return 400 when the requestBody doesn"t contain groupId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: testAccountId },
      }

      const expectedResponse = {
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

      console.log(res.payload)

      expect(res.statusCode).toEqual(expectedResponse.code)

      expect(error.length > 0).toEqual(true)

      expect(errorMessage).toEqual(expectedResponse.errorMessage)

      expect(isValid).toEqual(expectedResponse.isValid)
    })

    test('should return 403 when the requestBody accountId doesn"t has the permission for that groupid', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 11, groupId: testCategoryGroupId },
      }

      const expectedResponse = {
        code: 403,
        isValid: false,
        errorMessage: 'Permission Denied!',
        hashValue: null,
        error: null,
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage, error } = JSON.parse(res.payload)

      console.log(res.payload)

      expect(res.statusCode).toEqual(expectedResponse.code)

      expect(errorMessage).toEqual(expectedResponse.errorMessage)

      expect(isValid).toEqual(expectedResponse.isValid)
    })
  })
})
