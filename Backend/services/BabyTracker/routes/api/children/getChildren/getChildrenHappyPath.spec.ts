import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('Happy Path Get children endpoint test', () => {
  const childTableName = 'child'

  const testUrl = '/api/children/getchildren'
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
    test('should return 200 and children array when accountId matches with the stored children and the parentGroup children too', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 2 },
      }

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      const [child_1, child2, child3] = responseBody

      expect(res.statusCode).toEqual(200)
      expect(responseBody.length).toEqual(3)
      expect(child_1.name).toBe('test_child4')
      expect(child_1.birthDate).toBe(1655959122)
      expect(child_1.createdBy).toBe(2)
      //Check is the default child is the first element of the result array
      expect(child_1.isDefault).toBe(1)
      expect(child_1.isDeleted).toBe(null)

      expect(child2.name).toBe('test_child2')
      expect(child2.birthDate).toBe(1655959122)
      expect(child2.createdBy).toBe(2)
      //Check is the default child is the first element of the result array
      expect(child2.isDefault).toBe(0)
      expect(child2.isDeleted).toBe(null)

      //This block check is the parentPArtner"s child also returns
      expect(child3.name).toBe('test_child5')
      expect(child3.birthDate).toBe(1655959122)
      expect(child3.createdBy).toBe(4)
      //Check is the default child is the first element of the result array
      expect(child3.isDefault).toBe(0)
      expect(child3.isDeleted).toBe(null)
    })

    test('should return 200 and an empty array when the query didn"t found any registered children', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 30 },
      }

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(200)
      expect(responseBody.length).toEqual(0)
    })

    test('should return 200 and children array when the accountId didn"t created any child but his partner had', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 6 },
      }

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      const [child_1] = responseBody

      expect(res.statusCode).toEqual(200)
      expect(responseBody.length).toEqual(1)
      expect(child_1.name).toBe('test_child6')
      expect(child_1.birthDate).toBe(1655959122)
      expect(child_1.createdBy).toBe(5)
      //Check is the default child is the first element of the result array
      expect(child_1.isDefault).toBe(0)
      expect(child_1.isDeleted).toBe(null)
    })
  })
})
