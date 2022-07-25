import { knex } from '../../databases/sql'

const childWeightTableName = 'childWeight'
import { throwGlobalError } from '../../utils/errorHandling'

export const getLatestChildWeights = async (childId: number, pagerStart: number, pagerEnd: number) => {
  const dat1 = new Date(new Date().setDate(new Date().getDate() - pagerStart))
  const dat2 = new Date(new Date().setDate(new Date().getDate() - pagerEnd))

  const latestWeights: weightTableType[] = await knex(childWeightTableName)
    .select('id', 'childId', 'weight', 'comment', 'creationDate')
    .orderBy('creationDate', 'desc')
    .where({ childId: childId, isDeleted: null })
    .where('creationDate', '>=', dat2)
    .where('creationDate', '<', dat1)

  return latestWeights
}

export const insertNewChildWeight = async (childId: number, weight: number, comment: string = '', creationDate: number = Date.now(), accountId: number) => {
  const sqlInsertResult: number[] = await knex(childWeightTableName).insert({
    childId: childId,
    weight: weight,
    comment: comment,
    creationDate: creationDate,
    createdBy: accountId,
  })

  return sqlInsertResult
}

export const updateWeight = async (weightId: number, weight: number, childId: number, comment: string = '', creationDate: number) => {
  const updateResponse: number = await knex(childWeightTableName)
    .where({ id: weightId, isDeleted: null, childId: childId })
    .update({ weight: weight, comment: comment, creationDate: creationDate })

  return updateResponse
}

export const deleteWeight = async (weightId: number, childId: number) => {
  const deleteResult: number = await knex(childWeightTableName).where({ id: weightId, isDeleted: null, childId: childId }).update({ isDeleted: true })

  return deleteResult
}

interface weightTableType {
  id: number
  childId: number
  weight: number
  comment: string
  creationDate: Date
}

/*
  if (updateResponse > 1) throwGlobalError('Oppsy, Call the Sys Admin Now!!44!', 500)

  if (updateResponse != 1) throwGlobalError('Oppsy, something gone wrong!', 400)

    if (updateResponse > 1) throwGlobalError('Oppsy, Call the Sys Admin Now!!44!', 500)
  if (updateResponse != 1) throwGlobalError('Oppsy, something gone wrong!', 400)

*/
