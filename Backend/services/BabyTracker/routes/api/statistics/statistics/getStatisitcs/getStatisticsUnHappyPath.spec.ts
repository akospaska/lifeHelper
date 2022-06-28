import { serverInit } from '../../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../../databases/sql'

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

  describe('UnHappy Path', () => {
    describe('getLAtestActions actionId:1', () => {
      describe('Joi validation errors', () => {
        test('should return 400 and error details when accountId is missing from the request body', async () => {
          const injectOptions = {
            method: testMethod,
            url: testUrl,
            payload: { statisticsTypeId: 1, childId: 1, intervallStart: 0, intervallEnd: 7 },
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
                context: {
                  label: 'accountId',
                  key: 'accountId',
                },
              },
            ],
          }

          const res = await server.inject(injectOptions)

          const responseBody = JSON.parse(res.payload)

          expect(res.statusCode).toEqual(400)
          expect(responseBody).toEqual(expectedResponse)
        })
        test('should return 400 and error details when statisticsTypeId is missing', async () => {
          const injectOptions = {
            method: testMethod,
            url: testUrl,
            payload: { accountId: 1, childId: 1, intervallStart: 0, intervallEnd: 7 },
          }

          const expectedResponse = {
            code: 400,
            isValid: false,
            errorMessage: 'RequestBody Validation Failed',
            error: [
              {
                message: '"statisticsTypeId" is required',
                path: ['statisticsTypeId'],
                type: 'any.required',
                context: {
                  label: 'statisticsTypeId',
                  key: 'statisticsTypeId',
                },
              },
            ],
          }

          const res = await server.inject(injectOptions)

          const responseBody = JSON.parse(res.payload)

          expect(res.statusCode).toEqual(400)
          expect(responseBody).toEqual(expectedResponse)
        })

        test('should return 400 and error details when childId is missing', async () => {
          const injectOptions = {
            method: testMethod,
            url: testUrl,
            payload: { accountId: 1, statisticsTypeId: 1, intervallStart: 0, intervallEnd: 7 },
          }

          const expectedResponse = {
            code: 400,
            isValid: false,
            errorMessage: 'RequestBody Validation Failed',
            error: [
              {
                message: '"childId" is required',
                path: ['childId'],
                type: 'any.required',
                context: {
                  label: 'childId',
                  key: 'childId',
                },
              },
            ],
          }

          const res = await server.inject(injectOptions)

          const responseBody = JSON.parse(res.payload)

          expect(res.statusCode).toEqual(400)
          expect(responseBody).toEqual(expectedResponse)
        })

        test('should return 400 and error details when intervallStart is missing', async () => {
          const injectOptions = {
            method: testMethod,
            url: testUrl,
            payload: { accountId: 1, statisticsTypeId: 1, childId: 1, intervallEnd: 7 },
          }

          const expectedResponse = {
            code: 400,
            isValid: false,
            errorMessage: 'RequestBody Validation Failed',
            error: [
              {
                message: '"intervallStart" is required',
                path: ['intervallStart'],
                type: 'any.required',
                context: {
                  label: 'intervallStart',
                  key: 'intervallStart',
                },
              },
            ],
          }

          const res = await server.inject(injectOptions)

          const responseBody = JSON.parse(res.payload)

          expect(res.statusCode).toEqual(400)
          expect(responseBody).toEqual(expectedResponse)
        })

        test('should return 400 and error details when intervallEnd is missing', async () => {
          const injectOptions = {
            method: testMethod,
            url: testUrl,
            payload: { accountId: 1, statisticsTypeId: 1, childId: 1, intervallStart: 0 },
          }

          const expectedResponse = {
            code: 400,
            isValid: false,
            errorMessage: 'RequestBody Validation Failed',
            error: [
              {
                message: '"intervallEnd" is required',
                path: ['intervallEnd'],
                type: 'any.required',
                context: {
                  label: 'intervallEnd',
                  key: 'intervallEnd',
                },
              },
              {
                message: '"intervallStart" limit references "ref:intervallEnd" which must be a number',
                path: ['intervallStart'],
                type: 'any.ref',
                context: {
                  arg: 'limit',
                  ref: {
                    adjust: null,
                    in: false,
                    iterables: null,
                    map: null,
                    separator: '.',
                    type: 'value',
                    ancestor: 1,
                    path: ['intervallEnd'],
                    depth: 1,
                    key: 'intervallEnd',
                    root: 'intervallEnd',
                    display: 'ref:intervallEnd',
                  },
                  reason: 'must be a number',
                  label: 'intervallStart',
                  key: 'intervallStart',
                },
              },
            ],
          }

          const res = await server.inject(injectOptions)

          const responseBody = JSON.parse(res.payload)

          expect(res.statusCode).toEqual(400)
          expect(responseBody).toEqual(expectedResponse)
        })

        test('should return 400 and error details when intervallEnd less than intervall start', async () => {
          const injectOptions = {
            method: testMethod,
            url: testUrl,
            payload: { accountId: 1, statisticsTypeId: 1, childId: 1, intervallStart: 7, intervallEnd: 4 },
          }

          const expectedResponse = {
            code: 400,
            isValid: false,
            errorMessage: 'RequestBody Validation Failed',
            error: [
              {
                message: '"intervallStart" must be less than ref:intervallEnd',
                path: ['intervallStart'],
                type: 'number.less',
                context: {
                  limit: {
                    adjust: null,
                    in: false,
                    iterables: null,
                    map: null,
                    separator: '.',
                    type: 'value',
                    ancestor: 1,
                    path: ['intervallEnd'],
                    depth: 1,
                    key: 'intervallEnd',
                    root: 'intervallEnd',
                    display: 'ref:intervallEnd',
                  },
                  value: 7,
                  label: 'intervallStart',
                  key: 'intervallStart',
                },
              },
            ],
          }

          const res = await server.inject(injectOptions)

          const responseBody = JSON.parse(res.payload)

          expect(res.statusCode).toEqual(400)
          expect(responseBody).toEqual(expectedResponse)
        })
      })
      describe('Business logic errors', () => {
        test('should return 403 and error details when the childId is not belongs to the accountId', async () => {
          const injectOptions = {
            method: testMethod,
            url: testUrl,
            payload: { accountId: 1, statisticsTypeId: 1, childId: 111, intervallStart: 0, intervallEnd: 7 },
          }

          const expectedResponse = {
            code: 403,
            isValid: false,
            errorMessage: 'Access Denied!',
          }

          const res = await server.inject(injectOptions)

          const responseBody = JSON.parse(res.payload)

          expect(res.statusCode).toEqual(403)
          expect(responseBody).toEqual(expectedResponse)
        })

        test('should return 405 and error details when the statisticstypeId is a not valid ID', async () => {
          const injectOptions = {
            method: testMethod,
            url: testUrl,
            payload: { accountId: 1, statisticsTypeId: 1111, childId: 1, intervallStart: 0, intervallEnd: 7 },
          }

          const expectedResponse = {
            code: 405,
            isValid: false,
            errorMessage: 'Invalid Statistic ID!',
          }

          const res = await server.inject(injectOptions)

          const responseBody = JSON.parse(res.payload)

          expect(res.statusCode).toEqual(405)
          expect(responseBody).toEqual(expectedResponse)
        })
      })
    })
  })
})
