import { validatedSqlConnectionVariables } from '../../validation/server'

export let knex

const accountTableName = 'grocery'

const groceryCategoriesTableName = 'groceryCategories'

const groceryItemsTableName = 'groceryItem'

const groupConnectTableName = 'groupConnect'
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
  //Declare the table name variables

  //Create sql Query map -> Get own private or shared lists

  const sqlQueries = {
    bygroupId: { isDeleted: null, groupId: groupId },
    ownCategories: { createdBy: createdBy, isDeleted: null },
  }

  const sqlQuery = groupId === 0 ? sqlQueries.ownCategories : sqlQueries.bygroupId

  const categories: categorySqlResult[] = await knex(groceryCategoriesTableName)
    .select(['id', 'name', 'createdBy', 'groupId', 'priority'])
    .where(sqlQuery)

  //Extend the categories with groceryItems
  await Promise.all(
    categories.map(async (element, index) => {
      const groceryItemsWithTheActualCategoryId = await knex(groceryItemsTableName)
        .select(['id', 'name'])
        .where({ categoryId: element.id })

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
  const searchResult: { accountId: number }[] = await knex(groupConnectTableName)
    .join(groceryCategoriesTableName, `${groceryCategoriesTableName}.groupId`, `${groupConnectTableName}.groupId`)
    .select('groupConnect.accountId')
    .where({ 'groupConnect.accountId': accountId, 'groceryCategories.id': categoryId })

  return searchResult.length > 0 ? true : false
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

export const getGroups = async (accountId: number) => {
  const searchResult: groupConnectSqlResult = await knex(groupConnectTableName)
    .join('groceryGroup', 'groceryGroup.id', 'groupConnect.groupId')
    .select('groceryGroup.id', 'groceryGroup.groceryGroupName', 'groupConnect.accountId ')
    .where({ 'groupConnect.accountId': accountId })

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

export interface categorySqlResult {
  id: number
  name: string
  createdBy: number
  groupId: number
  priority: number
  groceryItemList: null | groceryItem[]
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
