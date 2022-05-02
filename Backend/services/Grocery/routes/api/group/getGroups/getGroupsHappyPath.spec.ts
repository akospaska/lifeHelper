import { serverInit } from '../../../../server'

import { groupConnectSqlResult, knex, prepareDbforTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('me  Endpoint test ', () => {
  const testUrl = '/api/group/getgroups'
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
    test('should return 400 when the requestBody has valid details', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 1 },
      }

      const expectedTestResponse = [
        {
          id: 1,
          groceryGroupName: 'GroupName1',
          accountId: 1,
        },
        {
          id: 2,
          groceryGroupName: 'GroupName2',
          accountId: 1,
        },
        {
          id: 4,
          groceryGroupName: 'GroupName4',
          accountId: 1,
        },
      ]

      const res = await server.inject(injectOptions)

      const testResponse: groupConnectSqlResult[] = JSON.parse(res.payload)

      expect(testResponse.length > 0).toEqual(true)
      expect(res.statusCode).toEqual(200)
    })
  })
})
