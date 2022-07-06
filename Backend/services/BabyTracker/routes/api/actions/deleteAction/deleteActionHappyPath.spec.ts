import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'
import { getActionById } from '../../../../dataAccessLayer/actions'

describe('Happy Path record actions automatically endpoint test test with DB connection', () => {
  const actionTableName = 'action'

  const testUrl = '/api/actions/deleteaction'
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
      await prepareDbForTests()
    })
    test('should return 200 and isValid:true when the requester accountId belongs actionId', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 1, actionId: 1 },
      }

      const expectedResponse = { isValid: true }
      const res = await server.inject(injectOptions)
      const responseBody = JSON.parse(res.payload)
      const deletedAction = await getActionById(1)

      expect(res.statusCode).toEqual(200)
      expect(responseBody).toEqual(expectedResponse)
      expect(deletedAction.length).toEqual(0)
    })
  })
})
