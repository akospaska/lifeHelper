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

  describe('Happy Path', () => {
    test('should return 200 when the requestBody has valid details', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          accountId: testAccountId,
          categoryId: testCategoryId,
          categoryDetails: {
            categoryName: testCategoryName,
            priority: testCategoryPrioirty,
            icon: 'i am the icon',
          },
        },
      }

      const expectedTestResponse = { isValid: true }

      const res = await server.inject(injectOptions)

      const testResponse = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(200)

      expect(testResponse.isValid).toEqual(expectedTestResponse.isValid)
    })
  })
})
