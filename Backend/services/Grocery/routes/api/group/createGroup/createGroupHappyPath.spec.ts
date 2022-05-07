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
    test('should return 200 when the requestBody has valid details', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: testInputAccountId, newGroupName: testInputNewCategoryName },
      }

      const expectedTestResponse = { isValid: true }

      const res = await server.inject(injectOptions)

      const testResponse = JSON.parse(res.payload)

      expect(testResponse).toEqual(expectedTestResponse)
      expect(res.statusCode).toEqual(200)
    })
  })
})
