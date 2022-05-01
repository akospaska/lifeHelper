import { serverInit } from '../../../../server'

import { knex, prepareDbforTests, sqlClose, sqlInit } from '../../../../databases/sql'

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
    test('should return 200 when the requestBody has valid details', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 1 },
      }

      const expectedOptions = [
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

      console.log(res)

      const { accountId, groupId, sessionKey } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(200)
    })
  })
})
