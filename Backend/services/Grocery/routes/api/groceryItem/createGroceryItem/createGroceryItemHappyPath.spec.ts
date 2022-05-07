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
    test('should return 200 when the requestBody has valid details', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          accountId: testAccountId,
          groupId: testGroupId,
          categoryId: testCategoryId,
          groceryItemName: testGroceryItemName,
        },
      }

      const expectedTestResponse = { isValid: true }

      const res = await server.inject(injectOptions)

      const testResponse = JSON.parse(res.payload)

      expect(testResponse.isValid).toEqual(expectedTestResponse.isValid)
      expect(res.statusCode).toEqual(200)
    })
  })
})
