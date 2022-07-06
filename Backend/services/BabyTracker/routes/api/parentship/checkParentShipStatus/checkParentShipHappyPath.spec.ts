import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('Happy Path parentship checkstatus endpoint test', () => {
  const childConnectTableName = 'parentConnect'

  const testUrl = '/api/parentship/checkstatus'
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
    test('should return 200 and isValid:true when the request body contains valid vaues and has a partner', async () => {
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

    test('should return 200 and isValid:false when the request body contains valid vaues and hasn"t got a parent', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 7 },
      }

      const expectedResponse = { isValid: false }
      const res = await server.inject(injectOptions)
      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(200)
      expect(responseBody).toEqual(expectedResponse)
    })
  })
})
