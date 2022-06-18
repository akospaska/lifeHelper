import { validatedSqlConnectionVariables } from '../../validation/server'

export let knex

const accountTableName = 'grocery'

const groceryCategoriesTableName = 'groceryCategories'

const groceryItemsTableName = 'groceryItem'

const groupConnectTableName = 'groupConnect'

const groceryGroupTableName = 'groceryGroup'
//joi validation env variable
export const sqlInit = async () => {
  knex = await require('knex')(validatedSqlConnectionVariables)
  await testSqlConnection()
}

export const sqlClose = async () => {
  await knex.destroy()
  console.log('Sql connection closed')
}

export const getCategoriesByGroupId = async (groupId: number) => {
  const categories: categories[] = await knex(groceryCategoriesTableName)
    .select(['id', 'name', 'priority'])
    .where({ groupId: groupId, isDeleted: null })

  return categories
}

export const getGroceryCategoriesWithItems = async (groupId: number, createdBy: number = 0) => {
  //Declare the table name variables

  //Create sql Query map -> Get own private or shared lists

  const sqlQueries = {
    bygroupId: { isDeleted: null, groupId: groupId },
    ownCategories: { createdBy: createdBy, isDeleted: null },
  }

  const sqlQuery = groupId === 0 ? sqlQueries.ownCategories : sqlQueries.bygroupId

  const categories: categoryWithItemsSqlResult[] = await knex(groceryCategoriesTableName)
    .select(['id', 'name', 'createdBy', 'groupId', 'priority', 'icon'])
    .where(sqlQuery)
    .orderBy('priority', 'desc')

  //Extend the categories with groceryItems
  await Promise.all(
    categories.map(async (element, index) => {
      const groceryItemsWithTheActualCategoryId = await knex(groceryItemsTableName)
        .select(['id', 'name'])
        .where({ categoryId: element.id, isDeleted: null })

      //Extend the category with groceryItems
      categories[index].groceryItemList = groceryItemsWithTheActualCategoryId
    })
  )

  //remove thoose categories which haven't got any groceryItem
  const filteredCategories = categories.filter(function (item) {
    return item.groceryItemList.length !== 0
  })

  return filteredCategories
}

export const isTheAccounIdBelongsToTheCategory = async (accountId: number, categoryId: number) => {
  console.log('I am the inputs')

  console.log(accountId)
  console.log(categoryId)
  const searchResult: { accountId: number }[] = await knex(groupConnectTableName)
    .join(groceryCategoriesTableName, `${groceryCategoriesTableName}.groupId`, `${groupConnectTableName}.groupId`)
    .select('groupConnect.accountId')
    .where({ 'groupConnect.accountId': accountId, 'groceryCategories.id': categoryId })
  console.log(searchResult.length > 0)

  console.log(searchResult)
  return searchResult.length > 0
  /*
select * from groupConnect gc 
join groceryCategories gCat on gCat.groupId = gc.groupId
where gc.accountId = 1 and gCat.id = 2
  */
}

export const updateCategory = async (
  categoryId: number,
  newCategoryName: string,
  priority: number,
  icon: string = ''
) => {
  const updateResponse: number = await knex(groceryCategoriesTableName)
    .where({ id: categoryId })
    .update({ name: newCategoryName, priority: priority })

  return updateResponse
}

export const deleteCategory = async (categoryId: number) => {
  const updateResponse: number = await knex(groceryCategoriesTableName)
    .where({ id: categoryId })
    .update({ isDeleted: true })

  return updateResponse
}

export const getGroups = async (accountId: number) => {
  const searchResult: groupConnectSqlResult = await knex(groupConnectTableName)
    .join('groceryGroup', 'groceryGroup.id', 'groupConnect.groupId')
    .select('groceryGroup.id', 'groceryGroup.groceryGroupName', 'groupConnect.accountId ')
    .where({ 'groupConnect.accountId': accountId })

  return searchResult
}

export const isTheAccountBelongsToTheGroup = async (accountId: number, groupId: number) => {
  const searchResult: { id: number }[] = await knex(groupConnectTableName)
    .select(['id'])
    .where({ accountId: accountId, groupId: groupId })

  return searchResult.length === 1
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

export const createNewCategory = async (
  categoryName: string,
  priority: number,
  groupId: number,
  createdBy: number,
  icon: string
) => {
  const sqlInsertResult = await knex(groceryCategoriesTableName).insert({
    name: categoryName,
    priority: priority,
    groupId: groupId,
    createdBy: createdBy,
    icon: icon,
  })

  return sqlInsertResult[0]
}

export const createNewGroceryItem = async (itemName: string, categoryId: number, createdBy: number) => {
  const sqlInsertResult = await knex(accountTableName).insert({
    itemName: itemName,
    categoryId: categoryId,
    createdBy: createdBy,
  })

  return sqlInsertResult
}

export const createNewGroceryGroup = async (newGroceryGroupName: string, createdBy: number) => {
  const sqlInsertResult: number[] = await knex(groceryGroupTableName).insert({
    groceryGroupName: newGroceryGroupName,
    createdBy: createdBy,
  })
  return sqlInsertResult[0]
}

export const insertNewGroupConnectRecord = async (accountId: number, groupId: number) => {
  const sqlInsertResult: number[] = await knex(groupConnectTableName).insert({
    accountId: accountId,
    groupId: groupId,
  })
  return sqlInsertResult[0]
}

export const deleteGroup = async (groupId: number) => {
  const updateResponse: number = await knex(groceryGroupTableName).where({ id: groupId }).update({ isdeleted: true })

  return updateResponse
}

export const deleteGroupConnectRecord = async (groupId: number, accountId: number) => {
  const deleteResponse: number = await knex(groupConnectTableName)
    .where({ groupId: groupId, accountId: accountId })
    .del()

  return deleteResponse
}

export const insertNewGroceryItem = async (accountId: number, categoryId: number, newGroceryItemName: string) => {
  const sqlInsertResult: number[] = await knex(groceryItemsTableName).insert({
    createdBy: accountId,
    categoryId: categoryId,
    name: newGroceryItemName,
  })
  return sqlInsertResult[0]
}

export const getGroceryItemDetails = async (groceryItemId: number) => {
  const searchResult: groceryItemDetails[] = await knex(groceryItemsTableName)
    .join(groceryCategoriesTableName, `${groceryCategoriesTableName}.id`, `${groceryItemsTableName}.categoryId`)
    .join(groceryGroupTableName, `${groceryGroupTableName}.id`, `${groceryCategoriesTableName}.groupId`)
    .select(
      `${groceryItemsTableName}.id as groceryItemId`,
      `${groceryItemsTableName}.name as groceryItemName`,
      `${groceryCategoriesTableName}.id as categoryId`,
      `${groceryGroupTableName}.id as groupId`
    )
    .where({ 'groceryItem.id': groceryItemId })

  return searchResult[0]
}

export const deleteGroceryItem = async (groceryItemId: number) => {
  const updateResponse: number = await knex(groceryItemsTableName)
    .where({ id: groceryItemId })
    .update({ isDeleted: true })

  return updateResponse
}

export interface categoryWithItemsSqlResult {
  id: number
  name: string
  createdBy: number
  groupId: number
  priority: number
  groceryItemList: null | groceryItem[]
  icon: string
}

export interface categories {
  id: number
  name: string
  priority: number
}

export interface groupConnectSqlResult {
  id: number
  groupId: number
  groupName: string
}

interface groceryItem {
  id: number
  name: string
}

export const prepareDbforTests = async () => {
  await knex.migrate
    .latest()
    .then(function () {
      return knex.seed.run()
    })
    .then(function () {
      console.log('Migrations have been done!')
    })
}

interface groceryItemDetails {
  groceryItemId: number
  groceryItemName: string
  categoryId: number
  groupId: number
}

if (process.env.NODE_ENV === 'prd') {
  const cron = require('node-cron')

  cron.schedule('1 * * * * *', async () => {
    if (knex) {
      console.log('Keep mysql connection alive')
      console.log(await knex.raw('SELECT 1'))
    }
  })
}
