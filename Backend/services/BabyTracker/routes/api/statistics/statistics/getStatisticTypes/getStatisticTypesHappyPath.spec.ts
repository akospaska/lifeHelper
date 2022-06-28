import { serverInit } from '../../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../../databases/sql'

describe('Happy Path Login Endpoint test with DB connection', () => {
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
    test('should return 200 and all the avalaible statistic types', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 1 },
      }

      const expectedResponse = [
        {
          id: 1,
          statisticName: 'Latest Actions',
        },
      ]

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(200)

      expect(responseBody).toEqual(expectedResponse)
    })
  })
})
