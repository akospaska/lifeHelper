import { knex } from '../../databases/sql'
import { deleteChildWeightType, getChildWeightsType, insertChildWeightType, updateChildWeightType } from '../../facade/childWeight'

const childWeightTableName = 'childWeight'

export const getLatestChildWeights = async (params: getChildWeightsType) => {
  const { childId, pagerStart, pagerEnd } = params
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

export const insertNewChildWeight = async (params: insertChildWeightType) => {
  const { childId, weight, comment, creationDate, accountId } = params
  const sqlInsertResult: number[] = await knex(childWeightTableName).insert({
    childId: childId,
    weight: weight,
    comment: comment,
    creationDate: creationDate,
    createdBy: accountId,
  })

  return sqlInsertResult
}

export const updateWeight = async (params: updateChildWeightType) => {
  const { weightId, childId, weight, comment = '', creationDate = Date.now() } = params
  const updateResponse: number = await knex(childWeightTableName)
    .where({ id: weightId, isDeleted: null, childId: childId })
    .update({ weight: weight, comment: comment, creationDate: creationDate })

  return updateResponse
}

export const deleteWeight = async (params: deleteChildWeightType) => {
  const { weightId, childId } = params
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
