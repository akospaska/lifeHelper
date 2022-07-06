import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'
import { getChild } from '../../../../dataAccessLayer/children'

describe('Happy Path Login Endpoint test with DB connection', () => {
  const childTableName = 'child'

  const testUrl = '/api/children/removechild'
  const testMethod = 'POST'

  let server

  beforeAll(async () => {
    await sqlInit()

    server = await serverInit()

    await prepareDbForTests()
  })

  afterAll(async () => {
    await knex(childTableName).truncate()
    await server.stop()
    await sqlClose()
  })

  describe('Happy Path', () => {
    test('should return 200 and isValid true object when the request body contains valid properties and values', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 1, childId: 1 },
      }

      const expectedResponse = { isValid: true }
      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      const deletedChild = await getChild(1, 1)

      expect(res.statusCode).toEqual(200)
      expect(responseBody).toEqual(expectedResponse)
      expect(deletedChild).toEqual([])
    })
  })
})
