const redis = require('redis')

let redisClient

import { throwGlobalError } from '../../utils/globalErrorHandler'
import { validatedWebProcessServerVariables } from '../../validation/server'

const { redisPort, redisHost, nodeEnv } = validatedWebProcessServerVariables

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

export const insertNewSession = async (sessionDetails: sessionDetailsRedis): Promise<number> => {
  const insertResult: number = await redisClient.sAdd(sessionDetails.sessionKey, JSON.stringify(sessionDetails))
  return insertResult
}

export const getSessionDetails = async (sessionKey: string): Promise<sessionDetailsRedis> => {
  const rawDetailsInStringFormat: string = await redisClient.sMembers(sessionKey)

  if (rawDetailsInStringFormat.length === 0) {
    throwGlobalError('session not found', 403)
  }

  console.log('From redis!!!!!!!!!!!!!')
  const accountDetails: sessionDetailsRedis = JSON.parse(rawDetailsInStringFormat)

  return accountDetails
}

export const flushRedisDb = async () => {
  await redisClient.flushdb((something: any) => {
    console.log(something)
  })
}

export interface sessionDetails {
  accountId: number | null
  isAdmin: boolean
}

export interface sessionDetailsRedis {
  accountId: number
  isAdmin: boolean
  groupId: number
  sessionKey: string
}

//keep the connection alive just for sure
if (nodeEnv === 'prd') {
  const cron = require('node-cron')

  cron.schedule('1 * * * * *', async () => {
    if (redisClient) {
      const pong = await redisClient.ping()
      console.log(pong)
    }
  })
}
