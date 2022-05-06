import { serverInit } from '../../../../server'

import { prepareDbforTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('me  Endpoint test ', () => {
  const testUrl = '/api/category/createcategory'
  const testMethod = 'POST'

  let server
  const testCategoryName = 'test category'
  const testCategoryPrioirty = 1
  const testGroupId = 1
  const testAccountId = 1

  let testCategoryId

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
    test('should return 400 and error details  when the requestBody doesn"t contain  an accountId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          groupId: testGroupId,
          priority: testCategoryPrioirty,
          icon: 'icon',
          newCategoryName: testCategoryName,
        },
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
      expect(isValid).toEqual(expectedResponse.isValid)
      expect(errorMessage).toEqual(expectedResponse.errorMessage)
      expect(error.length > 0).toEqual(true)
    })

    test('should return 400 and error details  when the requestBody doesn"t contain  a groupId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          accountId: testAccountId,
          priority: testCategoryPrioirty,
          icon: 'icon',
          newCategoryName: testCategoryName,
        },
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

      expect(res.statusCode).toEqual(expectedResponse.code)
      expect(isValid).toEqual(expectedResponse.isValid)
      expect(errorMessage).toEqual(expectedResponse.errorMessage)
      expect(error.length > 0).toEqual(true)
    })

    test('should return 400 and error details  when the requestBody doesn"t contain  a priority', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          accountId: testAccountId,
          groupId: testGroupId,
          icon: 'icon',
          newCategoryName: testCategoryName,
        },
      }

      const expectedResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        hashValue: null,
        error: [
          {
            message: '"priority" is required',
            path: ['priority'],
            type: 'any.required',
            context: { label: 'priority', key: 'priority' },
          },
        ],
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage, error } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedResponse.code)
      expect(isValid).toEqual(expectedResponse.isValid)
      expect(errorMessage).toEqual(expectedResponse.errorMessage)
      expect(error.length > 0).toEqual(true)
    })

    test('should return 400 and error details  when the requestBody doesn"t contain  an icon', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          accountId: testAccountId,
          groupId: testGroupId,
          priority: testCategoryPrioirty,
          newCategoryName: testCategoryName,
        },
      }

      const expectedResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        hashValue: null,
        error: [
          {
            message: '"icon" is required',
            path: ['icon'],
            type: 'any.required',
            context: { label: 'icon', key: 'icon' },
          },
        ],
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage, error } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedResponse.code)
      expect(isValid).toEqual(expectedResponse.isValid)
      expect(errorMessage).toEqual(expectedResponse.errorMessage)
      expect(error.length > 0).toEqual(true)
    })

    test('should return 400 and error details when the requestBody doesn"t contain  a newCategoryName', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          accountId: testAccountId,
          groupId: testGroupId,
          priority: testCategoryPrioirty,
          icon: 'icon',
          // newCategoryName: testCategoryName,
        },
      }

      const expectedResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        hashValue: null,
        error: [
          {
            message: '"newCategoryName" is required',
            path: ['newCategoryName'],
            type: 'any.required',
            context: { label: 'newCategoryName', key: 'newCategoryName' },
          },
        ],
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage, error } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedResponse.code)
      expect(isValid).toEqual(expectedResponse.isValid)
      expect(errorMessage).toEqual(expectedResponse.errorMessage)
      expect(error.length > 0).toEqual(true)
    })

    test('should return 403 and error details when the requestBody doesn"t contain an accountId what is not belong to the groupId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          accountId: 1,
          groupId: 11,
          priority: testCategoryPrioirty,
          icon: 'icon',
          newCategoryName: testCategoryName,
        },
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
      expect(isValid).toEqual(expectedResponse.isValid)
      expect(errorMessage).toEqual(expectedResponse.errorMessage)
      expect(error).toEqual(expectedResponse.error)
    })
  })
})
