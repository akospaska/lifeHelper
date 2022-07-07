import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('Happy Path parentship divorce parentship endpoint test', () => {
  const childConnectTableName = 'parentConnect'

  const testUrl = '/api/parentship/divorce'
  const testMethod = 'POST'

  let server

  beforeAll(async () => {
    await sqlInit()
    server = await serverInit()
    await prepareDbForTests()
  })

  afterAll(async () => {
    await knex(childConnectTableName).truncate()
    await server.stop()
    await sqlClose()
  })

  describe('Happy Path', () => {
    test('should return 200 and isValid:true the requestergot a partner and the request body contains valid data', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 1 },
      }

      const expectedResponse = { isValid: true }

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(200)
      expect(responseBody).toEqual(expectedResponse)
    })
  })
})
