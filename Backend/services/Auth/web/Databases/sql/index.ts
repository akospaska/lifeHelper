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
): Promise<{ isValid: boolean; isAdmin: boolean; accountId: number; groupId: number }> => {
  const searchResultArray: { id: number; isAdmin: boolean; groupId: number }[] = await knex(accountTableName)
    .select(['id', 'isAdmin', 'groupId'])
    .where({
      email: email,
      password: hashedPassword,
      isDeleted: null,
      isConfirmed: true,
    })

  const searchResult = searchResultArray[0]

  return {
    isValid: searchResultArray.length === 1,
    isAdmin: searchResult?.isAdmin,
    accountId: searchResult?.id,
    groupId: searchResult?.groupId,
  }
}

export const isTheEmailAlreadyRegistered = async (email: string): Promise<Boolean> => {
  const searchResultArray: { id: number; isAdmin: boolean; groupId: number }[] = await knex(accountTableName)
    .select(['id', 'isAdmin', 'groupId'])
    .where({ email: email, isDeleted: null, isConfirmed: true })

  return searchResultArray.length > 0 ? true : false
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

export const isTheAccountAdmin = async (accountId: number) => {
  const searchResultArray: { id: number; isAdmin: boolean; groupId: number }[] = await knex(accountTableName)
    .select(['id', 'isAdmin'])
    .where({ id: accountId, isDeleted: null, isConfirmed: true })

  return searchResultArray[0]?.isAdmin
}

export const registerNewAccountAndGetId = async (
  email: string,
  password: string,
  isAdmin: boolean,
  createdBy: number
) => {
  const insertResult = await knex('account').insert({
    email: email,
    password: stringToSHA512(password),
    isAdmin: isAdmin,
    createdBy: createdBy,
  })

  const newAccountId: number = insertResult[0]
  return newAccountId
}

export const insertNewConfirmationToken = async (accountId: number, confirmationToken: string) => {
  const insertResult: number[] = await knex('registerConfirmation').insert({
    accountId: accountId,
    confirmationToken: confirmationToken,
  })

  return insertResult
}

export const dropDatabase = async (databaseName: string) => {
  if (process.env.AUTH_WEB_IS_TEST_RUN === 'true') {
    await knex.raw(`drop database ${databaseName}`)
  }
}

export const createDatabase = async (databaseName: string) => {
  if (process.env.AUTH_WEB_IS_TEST_RUN === 'true') {
    const x = await knex.raw(`create database ${databaseName}`)
  }
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
