import { serverInit } from '../../../../server'

import {
  categorySqlResult,
  groupConnectSqlResult,
  knex,
  prepareDbforTests,
  sqlClose,
  sqlInit,
} from '../../../../databases/sql'

describe('me  Endpoint test ', () => {
  const testUrl = '/api/category/getcategorieswithitems'
  const testMethod = 'POST'

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
        payload: { accountId: 1, groupId: 1 },
      }

      const expectedTestResponse = [
        {
          id: 2,
          name: 'category2',
          createdBy: 1,
          groupId: 1,
          priority: 4,
          groceryItemList: [
            { id: 5, name: 'item5' },
            { id: 6, name: 'item3' },
          ],
        },
        {
          id: 4,
          name: 'category4',
          createdBy: 1,
          groupId: 1,
          priority: 3,
          groceryItemList: [{ id: 8, name: 'item5' }],
        },
      ]

      const res = await server.inject(injectOptions)

      const testResponse: categorySqlResult[] = JSON.parse(res.payload)

      const { name, createdBy, groceryItemList, groupId, priority } = expectedTestResponse[0]

      expect(res.statusCode).toEqual(200)
      expect(typeof name).toEqual('string')
      expect(createdBy).toEqual(1)
      expect(groceryItemList.length > 0).toEqual(true)
      expect(groupId).toEqual(1)
      expect(typeof priority).toEqual('number')
      expect(testResponse.length > 0).toEqual(true)
    })
  })
})
