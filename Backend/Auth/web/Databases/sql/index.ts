import { stringToSHA512 } from '../../tools/encryption'
import { validatedSqlConnectionVariables } from '../../validation/server'

export let knex

const accountTableName = 'account'
//joi validation env variable
export const sqlInit = async () => {
  knex = await require('knex')(validatedSqlConnectionVariables)
  await testSqlConnection()
}

export const sqlClose = async () => {
  await knex.destroy()
  console.log('Sql connection closed')
}

export const validateLoginCredentials = async (
  email: string,
  hashedPassword: string
): Promise<{ isValid: boolean; isAdmin: boolean; accountId: number }> => {
  const searchResultArray: { id: number; isAdmin: boolean }[] = await knex(accountTableName)
    .select(['id', 'isAdmin'])
    .where({
      email: email,
      password: hashedPassword,
      isDeleted: null,
    })

  const searchResult = searchResultArray[0]

  return {
    isValid: searchResultArray.length === 1,
    isAdmin: searchResult?.isAdmin,
    accountId: searchResult?.id,
  }
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
  const searchResultArray: { id: number; isAdmin: boolean }[] = await knex(accountTableName)
    .select(['id', 'isAdmin'])
    .where({ username: username, isDeleted: null })

  return searchResultArray.length > 0 ? true : false
}

export const registerNewAccount = async (username: string, isAdmin: boolean, createdBy: number) => {
  const x = await knex('account').insert({
    username: username,
    password: stringToSHA512(process.env.DEFAULT_ACCOUNT_PASSWORD),
    isAdmin: isAdmin,
    createdBy: createdBy,
  })
  console.log(x)

  return x
}

export const dropDatabase = async (databaseName: string) => {
  if (process.env.AUTH_WEB_IS_TEST_RUN === 'true') {
    await knex.raw(`drop database ${databaseName}`)
  }
}

export const createDatabase = async (databaseName: string) => {
  if (process.env.AUTH_WEB_IS_TEST_RUN === 'true') {
    const x = await knex.raw(`create database ${databaseName}`)

    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    console.log(x)
  }
}
