import { validatedSqlConnectionVariables } from '../../validation/server'

export let knex

const accountTableName = 'grocery'
//joi validation env variable
export const sqlInit = async () => {
  knex = await require('knex')(validatedSqlConnectionVariables)
  await testSqlConnection()
}

export const sqlClose = async () => {
  await knex.destroy()
  console.log('Sql connection closed')
}

export const getGroceryCategories = async (groupId: number, createdBy: number = 0) => {
  const groceryCategoriesTableName = 'groceryCategories'

  console.log('I am in the grocery category')

  const sqlQueryMap = new Map()

  sqlQueryMap.set('byGroupId', {
    isDeleted: null,
    groupId: groupId,
  })

  sqlQueryMap.set('ownCategories', {
    createdBy: createdBy,
    isDeleted: null,
  })

  const sqlQuery = groupId === 0 ? sqlQueryMap.get('ownCategories') : sqlQueryMap.get('byGroupId')

  const searchResult: categorySqlResult = await knex(groceryCategoriesTableName)
    .select(['id', 'name', 'createdBy', 'groupId', 'priority'])
    .where(sqlQuery)

  return searchResult
}

export const getGroups = async (accountId: number) => {
  const groupConnectTableName = 'groupConnect'

  const searchResult: groupConnectSqlResult = await knex(groupConnectTableName)
    .select(['id', 'groupId', 'groupName'])
    .where({ accountId: accountId })

  return searchResult
}

export const testSqlConnection = async () => {
  try {
    await knex.raw('SELECT 1')

    console.log(await knex.raw('show databases'))
    console.log('Mysql connected')
  } catch (err) {
    console.log('Mysql not connected')
    console.error(err)
    throw err
  }
}

export const isNewUserNameAllreadyExists = async (username: string) => {
  const searchResultArray: { id: number; isAdmin: boolean; groupId: number }[] = await knex(accountTableName)
    .select(['id', 'isAdmin'])
    .where({ username: username, isDeleted: null })

  return searchResultArray.length > 0 ? true : false
}

export const createNewCategory = async (categoryName: string, priority: number, groupId: number, createdBy: number) => {
  const sqlInsertResult = await knex(accountTableName).insert({
    categoryName: categoryName,
    priority: priority,
    groupId: groupId,
    createdBy: createdBy,
  })

  return sqlInsertResult
}

export const createNewGroceryItem = async (itemName: string, categoryId: number, createdBy: number) => {
  const sqlInsertResult = await knex(accountTableName).insert({
    itemName: itemName,
    categoryId: categoryId,
    createdBy: createdBy,
  })

  return sqlInsertResult
}

interface categorySqlResult {
  id: number
  name: string
  createdBy: number
  groupId: number
  priority: number
}

interface groupConnectSqlResult {
  id: number
  groupId: number
  groupName: string
}
