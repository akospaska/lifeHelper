const redis = require('redis')

let redisClient

import { validatedWebProcessServerVariables } from '../../validation/server'

const { redisPort, redisHost } = validatedWebProcessServerVariables

const redisTableName = 'sessions'

export const redisInIt = async () => {
  redisClient = redis.createClient({
    url: `redis://${redisHost}:${redisPort}`,
  })

  /*set by the default endpoint and port*/

  redisClient.on('error', (err) => {
    console.log(err)
  })

  await redisClient.connect()

  console.log('REDIS connected')
}

export const redisClose = async () => {
  await redisClient.quit()
}

const quit = async () => {
  await redisClient.quit()
}

export const insertNewSession = async (
  accountId: number,
  isAdmin: boolean,
  newSessionHash: string
): Promise<number> => {
  const sessionValue = { accountId: accountId, isAdmin: isAdmin }
  const insertResult: number = await redisClient.sAdd(newSessionHash, JSON.stringify(sessionValue))
  return insertResult
}

export const getAccountIdFromSessionKey = async (sessionKey: string): Promise<sessionDetails> => {
  const rawDetailsInStringFormat: string = await redisClient.sMembers(sessionKey)

  if (rawDetailsInStringFormat.length === 0) {
    return {
      accountId: null,
      isAdmin: false,
    }
  }
  const accountDetails: sessionDetails = JSON.parse(rawDetailsInStringFormat)

  return accountDetails
}

export const flushRedisDb = async () => {
  await redisClient.flushdb((something: any) => {
    console.log('i am the redis something')
    console.log(something)
  })
}

export interface sessionDetails {
  accountId: number | null
  isAdmin: boolean
}
