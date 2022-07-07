import { serverInit } from '../../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../../databases/sql'

describe('Happy Path get statistics type endpoint tests', () => {
  const statisticsTypeTableName = 'statisticsType'

  const testUrl = '/api/statistics/statistics/getstatistictypes'
  const testMethod = 'POST'

  let server

  beforeAll(async () => {
    await sqlInit()

    server = await serverInit()

    await prepareDbForTests()
  })

  beforeEach(async () => {
    await prepareDbForTests()
  })

  afterAll(async () => {
    await knex(statisticsTypeTableName).truncate()
    await server.stop()
    await sqlClose()
  })

  describe('Happy Path', () => {
    test('should return 400 and error details when the accountId is missing from the request body', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {},
      }

      const expectedResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        error: [
          {
            message: '"accountId" is required',
            path: ['accountId'],
            type: 'any.required',
            context: { label: 'accountId', key: 'accountId' },
          },
        ],
      }

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)

      expect(responseBody).toEqual(expectedResponse)
    })
  })
})
