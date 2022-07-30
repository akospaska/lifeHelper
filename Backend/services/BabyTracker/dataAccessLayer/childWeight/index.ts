import { knex } from '../../databases/sql'
import { deleteChildWeightType, getChildWeightsType, insertChildWeightType, updateChildWeightType } from '../../facade/childWeight'
import { validatedServerVariables } from '../../validation/server'

const childWeightTableName = 'childWeight'

export const getLatestChildWeights = async (params: getChildWeightsType) => {
  const { childId, pagerStart, pagerEnd } = params
  const dat1 = new Date(new Date().setDate(new Date().getDate() - pagerStart))
  const dat2 = new Date(new Date().setDate(new Date().getDate() - pagerEnd))

  const latestWeights: weightTableType[] = await knex(childWeightTableName)
    .select('id', 'childId', 'weight', 'comment', 'date')
    .orderBy('date', 'desc')
    .where({ childId: childId, isDeleted: null })
    .where('creationDate', '>=', dat2)
    .where('creationDate', '<', dat1)

  return latestWeights
}

export const isTheWeightAlreadyRegisteredForThatDate = async (childId: number, date: number) => {
  const checkWeight = await knex(childWeightTableName)
    .select('id', 'childId', 'weight', 'comment', 'date')
    .where({ childId: childId, isDeleted: null, date: date })

  return checkWeight.length > 0
}

export const insertNewChildWeight = async (params: insertChildWeightType) => {
  const { childId, weight, comment, date, accountId } = params
  const sqlInsertResult: number[] = await knex(childWeightTableName).insert({
    childId: childId,
    weight: weight,
    comment: comment,
    date: date,
    createdBy: accountId,
  })

  return sqlInsertResult
}

export const updateWeight = async (params: updateChildWeightType) => {
  const { weightId, childId, weight, comment = '', date } = params
  const updateResponse: number = await knex(childWeightTableName)
    .where({ id: weightId, isDeleted: null, childId: childId })
    .update({ weight: weight, comment: comment, date: date })

  return updateResponse
}

export const deleteWeight = async (params: deleteChildWeightType) => {
  const { weightId, childId } = params
  const deleteResult: number = await knex(childWeightTableName).where({ id: weightId, isDeleted: null, childId: childId }).update({ isDeleted: true })

  return deleteResult
}

export interface weightTableType {
  id: number
  childId: number
  weight: number
  comment: string
  date: number
  formattedDate: string | null
}
