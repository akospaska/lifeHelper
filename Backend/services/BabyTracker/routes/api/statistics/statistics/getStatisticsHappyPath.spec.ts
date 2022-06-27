import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('Happy Path Login Endpoint test with DB connection', () => {
  const actionTableName = 'action'

  const testUrl = '/api/statistics/statistics/getstatistics'
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
    await knex(actionTableName).truncate()
    await server.stop()
    await sqlClose()
  })

  describe('Happy Path', () => {
    describe('getLAtestActions actionId:1', () => {
      test('should return 200 and latest statistics when the request payload contains valid values', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, statisticsTypeId: 1, childId: 1, intervallStart: 0, intervallEnd: 7 },
        }

        const expectedResponse = [
          {
            date: '2022/6/27',
            data: [
              {
                id: 2,
                actionId: 2,
                actionStart: 1656355140,
                actionEnd: 1656355340,
                childId: 1,
                comment: null,
                creationDate: '2022-06-27T17:05:39.000Z',
                duration: '03:20',
                startTime: '20:39:00',
                endTime: '20:42:20',
              },
              {
                id: 3,
                actionId: 3,
                actionStart: 1656355440,
                actionEnd: 1656355740,
                childId: 1,
                comment: null,
                creationDate: '2022-06-27T17:05:39.000Z',
                duration: '05:00',
                startTime: '20:44:00',
                endTime: '20:49:00',
              },
            ],
          },
        ]

        const res = await server.inject(injectOptions)
        console.log(res.payload)

        const responseBody = JSON.parse(res.payload)

        const testDay = responseBody[0]

        expect(res.statusCode).toEqual(200)
        expect(responseBody.length).toEqual(1)
        expect(responseBody[0].data.length).toEqual(2)
        expect(testDay.date).toBeTruthy()
        expect(testDay.data[0].startTime).toBeTruthy()
      })
    })
  })
})
