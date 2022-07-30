import { isTheChildBelongsToTheAccountId } from '../../dataAccessLayer/children'
import {
  deleteWeight,
  getLatestChildWeights,
  insertNewChildWeight,
  isTheWeightAlreadyRegisteredForThatDate,
  updateWeight,
} from '../../dataAccessLayer/childWeight'
import { throwGlobalError } from '../../utils/errorHandling'
import { addFormattedDateProperty, getYYMMDDFromDate, roundTimeStampToDate } from '../../utils/Time'
import { validatedServerVariables } from '../../validation/server'

export const getChildWeights = async (params: getChildWeightsType) => {
  const { childId, accountId } = params
  await isTheChildBelongsToTheAccountId(childId, accountId)

  const latestWeights = await getLatestChildWeights(params)

  return addFormattedDateProperty(latestWeights)
}

export const insertChildWeight = async (params: insertChildWeightType) => {
  const { childId, accountId } = params
  await isTheChildBelongsToTheAccountId(childId, accountId)

  params.date = roundTimeStampToDate(params.date)

  const isAlreadyRegistered = await isTheWeightAlreadyRegisteredForThatDate(childId, params.date)

  if (isAlreadyRegistered) throwGlobalError('Already registered for that day', 405)

  const newInsertResult = await insertNewChildWeight(params)

  if (newInsertResult.length > 1 || newInsertResult.length === 0) {
    throwGlobalError('Bad Request', 400)
  }

  return { isValid: true }
}

export const updateChildWeight = async (params: updateChildWeightType) => {
  const { childId, accountId } = params
  await isTheChildBelongsToTheAccountId(childId, accountId)
  const updateResult = await updateWeight(params)

  if (updateResult > 1) throwGlobalError('Oppsy, Call the Sys Admin Now!!44!', 500)
  if (updateResult != 1 || !updateResult) throwGlobalError('Oppsy, something gone wrong!', 500)

  return { isValid: true }
}

export const deleteChildWeight = async (params: deleteChildWeightType) => {
  const { childId, accountId } = params

  await isTheChildBelongsToTheAccountId(childId, accountId)

  const deleteResult = await deleteWeight(params)

  if (deleteResult > 1) throwGlobalError('Oppsy, Call the Sys Admin Now!!44!', 500)
  if (deleteResult != 1) throwGlobalError('Oppsy, something gone wrong!', 400)

  return { isValid: true }
}

export interface deleteChildWeightType {
  weightId: number
  childId: number
  accountId: number
}

export interface updateChildWeightType {
  weightId: number
  weight: number
  childId: number
  comment: string
  creationDate: number
  accountId: number
  date: number
}

export interface insertChildWeightType {
  childId: number
  weight: number
  comment: string
  creationDate: number
  accountId: number
  date: number
}

export interface getChildWeightsType {
  accountId: number
  childId: number
  pagerStart: number
  pagerEnd: number
}
