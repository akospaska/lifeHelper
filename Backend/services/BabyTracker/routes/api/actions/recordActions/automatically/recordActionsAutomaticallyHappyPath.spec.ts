import { serverInit } from '../../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../../databases/sql'

describe('Happy Path record actions automatically endpoint test test with DB connection', () => {
  const actionTableName = 'action'

  const testUrl = '/api/actions/recordactions/automatically'
  const testMethod = 'POST'

  let server

  beforeAll(async () => {
    await sqlInit()
    server = await serverInit()
    await prepareDbForTests()
  })

  afterAll(async () => {
    await knex(actionTableName).truncate()
    await server.stop()
    await sqlClose()
  })

  describe('Happy Path', () => {
    beforeEach(async () => {
      await knex(actionTableName).truncate()
    })
    test('should return 200 and isValid:true when the requester accountId belongs to the child and by the child are no any active recoring under the requested actionId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 1, childId: 1, actionId: 4 },
      }

      const expectedResponse = { isValid: true }

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      //check the actionIds enums
      expect(res.statusCode).toEqual(200)
      expect(responseBody).toEqual(expectedResponse)
    })
  })
})
