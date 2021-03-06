import { stringToSHA512 } from '../../tools/encryption'
import { throwGlobalError } from '../../utils/globalErrorHandler'
import { validatedSqlConnectionVariables } from '../../validation/server'

import { validatedWebProcessServerVariables } from '../../validation/server'

const { passwordSaltKey, nodeEnv } = validatedWebProcessServerVariables

export let knex

const accountTableName = 'account'

const registerConfirmationTableName = 'registerConfirmation'
//joi validation env variable
export const sqlInit = async () => {
  console.log(validatedSqlConnectionVariables)
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

export const getUserIdByEmail = async (email: string) => {
  const searchResultArray: { id: number; isAdmin: boolean; groupId: number }[] = await knex(accountTableName)
    .select(['id'])
    .where({ email: email, isDeleted: null, isConfirmed: true })

  return searchResultArray[0]?.id
}

export const isTheAccountAdmin = async (accountId: number) => {
  const searchResultArray: { id: number; isAdmin: boolean; groupId: number }[] = await knex(accountTableName)
    .select(['id', 'isAdmin'])
    .where({ id: accountId, isDeleted: null, isConfirmed: true })

  return searchResultArray[0]?.isAdmin
}

export const getTokenDetails = async (token: string) => {
  const searchResultArray: registerConfirmationTable[] = await knex(registerConfirmationTableName)
    .select(['id', 'accountId', 'confirmationToken', 'isConfirmed', 'creationDate'])
    .where({
      confirmationToken: token,
      isConfirmed: 0,
    })

  if (!searchResultArray[0]) throwGlobalError('Token not found or expired', 403)

  const time = searchResultArray[0].creationDate
  //das ist sql
  const time1 = '2022-05-04T13:56:27.000Z'
  const time2 = '2022-06-04T13:56:27.000Z'

  console.log(time1 < time2)

  const date = new Date()
  console.log(date)
  date.setDate(date.getDate() - 4)
  console.log(date)

  return searchResultArray[0]
}

export const isForgotPasswordTokenValid = async (token: string, accountId: number) => {
  const expirationDate = new Date()
  console.log(expirationDate)
  expirationDate.setDate(expirationDate.getDate() - 4)

  const searchResultArray: registerConfirmationTable[] = await knex('forgotPasswordRequest')
    .select(['id', 'accountId', 'forgotPasswordToken', 'isConfirmed', 'creationDate'])
    .where({
      forgotPasswordToken: token,
      isConfirmed: 0,
      accountId: accountId,
    })
    .where('creationDate', '>=', expirationDate)

  return searchResultArray[0] ? true : false
}

export const confirmAccount = async (accountId: number) => {
  const updateResponse = await knex(accountTableName).where({ id: accountId }).update({ isConfirmed: 1 })

  return updateResponse
}

export const changePassword = async (accountId: number, newPassword) => {
  const updateResponse = await knex(accountTableName)
    .where({ id: accountId, isConfirmed: 1, isDeleted: null })
    .update({ password: stringToSHA512(passwordSaltKey + newPassword) })

  return updateResponse
}

export const validateRegisterAccountToken = async (token: string) => {
  const accountDetails = await getTokenDetails(token)

  console.log('I am the token details')
  console.log(accountDetails)

  const confirmAccountResponse: number = await confirmAccount(accountDetails?.accountId)

  return confirmAccountResponse === 0 ? false : true
}

export const registerNewAccountAndGetId = async (
  email: string,
  password: string,
  isAdmin: boolean,
  createdBy: number
) => {
  const insertResult = await knex('account').insert({
    email: email,
    password: stringToSHA512(passwordSaltKey + password),
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
export const insertNewForgotPasswordToken = async (accountId: number, forgotPasswordToken: string) => {
  const insertResult: number[] = await knex('forgotPasswordRequest').insert({
    accountId: accountId,
    forgotPasswordToken: forgotPasswordToken,
  })

  return insertResult[0]
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

export interface accountTable {
  id: number
  email: string
  password: string
  createdBy: number
  isAdmin: boolean
  groupId: number
  isDeleted: boolean
  isConfirmed: boolean
  creationDate: string
}

export interface registerConfirmationTable {
  id: number
  accountId: number
  confirmationToken: string
  isConfirmed: boolean
  creationDate: string
}
if (nodeEnv === 'prd') {
  //keep the connection alive just for sure
  const cron = require('node-cron')

  cron.schedule('1 * * * * *', async () => {
    if (knex) {
      console.log(await knex.raw('SELECT 1'))
    }
  })
}

export const getAccountIdByEmail = async (email: string) => {
  const searchResultArray: { id: number; isAdmin: boolean; groupId: number }[] = await knex(accountTableName)
    .select(['id', 'isAdmin', 'groupId'])
    .where({
      email: email,
      isDeleted: null,
      isConfirmed: true,
    })

  if (!searchResultArray[0]?.id) throwGlobalError('Email Not found!', 403)
  return searchResultArray[0]?.id
}

export const getEmailByAccountId = async (accountId: number) => {
  const searchResultArray: { id: number; email: string }[] = await knex(accountTableName)
    .select(['id', 'email'])
    .where({
      id: accountId,
      isDeleted: null,
      isConfirmed: true,
    })

  if (!searchResultArray[0]?.id) throwGlobalError('Email Not found!', 403)
  return searchResultArray[0]
}
