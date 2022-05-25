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

  describe('Happy Path', () => {
    test('should return 200 when the requestBody has valid details', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: testAccountId, groupId: testCategoryGroupId },
      }

      const res = await server.inject(injectOptions)

      const testResponse = JSON.parse(res.payload)

      console.log(res.payload)

      expect(res.statusCode).toEqual(200)

      expect(testResponse.length > 0).toEqual(true)
    })
  })
})
