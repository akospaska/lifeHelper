import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('Happy Path get action statuses endpoint test with DB connection', () => {
  const actionTableName = 'action'

  const testUrl = '/api/actions/stopactions'
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
  afterEach(async () => {
    await knex(actionTableName).truncate()
  })

  describe('Happy Path', () => {
    test('should return 200 and an isValid:true when the action is ON recording and belongs to the childID and the requester"s actionID', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 1, childId: 1, incrementedActionId: 1 },
      }

      //The timeStamps are generated by the date.now so the test doesn't check the exact value
      const expectedResponse = { isValid: true }

      const res = await server.inject(injectOptions)

      console.log(res.payload)
      const responseBody = JSON.parse(res.payload)

      //check the actionIds enums
      expect(res.statusCode).toEqual(200)
      expect(responseBody).toEqual(expectedResponse)
    })
  })
})
