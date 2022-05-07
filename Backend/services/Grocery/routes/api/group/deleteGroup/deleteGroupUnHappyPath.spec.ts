import { serverInit } from '../../../../server'

import {
  createNewGroceryGroup,
  insertNewGroupConnectRecord,
  prepareDbforTests,
  sqlClose,
  sqlInit,
} from '../../../../databases/sql'

describe('me  Endpoint test ', () => {
  const testUrl = '/api/group/deletegroup'
  const testMethod = 'POST'

  const testAccountId = 1
  const testGroupName = 'I am the testgroup'
  let newTestGroupId

  let server

  beforeAll(async () => {
    await sqlInit()
    server = await serverInit()
    await prepareDbforTests()

    newTestGroupId = await createNewGroceryGroup(testGroupName, testAccountId)
    await insertNewGroupConnectRecord(testAccountId, newTestGroupId)
  })

  afterAll(async () => {
    await server.stop()
    await sqlClose()
  })

  describe('UnHappy Path', () => {
    test('should return 403 and error details when the account is not belong to the groceryGroup', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: testAccountId, groupId: 23422 },
      }

      const expectedTestResponse = {
        code: 403,
        isValid: false,
        errorMessage: 'Permission denied!',
        hashValue: null,
        error: null,
        isAdmin: false,
      }

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage } = JSON.parse(res.payload)

      console.log(res.payload)

      expect(isValid).toEqual(expectedTestResponse.isValid)
      expect(errorMessage).toEqual(expectedTestResponse.errorMessage)
      expect(res.statusCode).toEqual(403)
    })

    test('should return 400 and error details when the request body doesn"t contain an accountId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { groupId: newTestGroupId },
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

    test('should return 400 and error details when the request body doesn"t contain a groupId', async () => {
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
  })
})
