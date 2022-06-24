import { serverInit } from '../../../../server'

import { prepareDbforTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('me  Endpoint test ', () => {
  const testUrl = '/api/group/creategroup'
  const testMethod = 'POST'

  const testInputAccountId = 1
  const testInputNewCategoryName = 'New category'

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
    test('should return 400 when the requestBody doesn"t contain an accountId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { newGroupName: testInputNewCategoryName },
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

    test('should return 400 when the requestBody doesn"t contain a new group name', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: testInputAccountId },
      }

      const expectedTestResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        hashValue: null,
        error: [
          {
            message: '"newGroupName" is required',
            path: ['newGroupName'],
            type: 'any.required',
            context: { label: 'newGroupName', key: 'newGroupName' },
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
