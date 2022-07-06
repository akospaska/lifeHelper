import { serverInit } from '../../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../../databases/sql'

describe('Happy Path record actions automatically endpoint test test with DB connection', () => {
  const actionTableName = 'action'

  const testUrl = '/api/actions/recordactions/manually'
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
    test('should return 200 and isValid:true when all of the request body properties are valid', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          accountId: 1,
          childId: 1,
          actionId: 1,
          actionStart: 1657089699,
          actionEnd: 1657089699,
          comment: 'I am the comment',
        },
      }

      const expectedResponse = { isValid: true }
      const res = await server.inject(injectOptions)
      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(200)
      expect(responseBody).toEqual(expectedResponse)
    })

    test('should return 200 and isValid:true when the comment property is missing from the request body', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          accountId: 1,
          childId: 1,
          actionId: 1,
          actionStart: 1657089699,
          actionEnd: 1657089699,
        },
      }

      const expectedResponse = { isValid: true }
      const res = await server.inject(injectOptions)
      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(200)
      expect(responseBody).toEqual(expectedResponse)
    })
  })
})
