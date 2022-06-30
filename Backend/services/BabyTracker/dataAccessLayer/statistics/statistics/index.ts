import { knex } from '../../../databases/sql'
import { throwGlobalError } from '../../../utils/errorHandling'
import { isTheChildBelongsToTheAccountId } from '../../children'

const actionTableName = 'action'

const statisticsTypeTableName = 'statisticsType'

export const getLatestActions = async (childId: number, pagerStart: number, pagerEnd: number) => {
  const dat1 = new Date(new Date().setDate(new Date().getDate() - pagerStart))
  const dat2 = new Date(new Date().setDate(new Date().getDate() - pagerEnd))

  const latestActions: actionTableType[] = await knex(actionTableName)
    .select('id', 'actionId', 'actionStart', 'actionEnd', 'childId', 'comment', 'creationDate')
    .orderBy('creationDate', 'desc')
    .where({ childId: childId, isDeleted: null })
    .where('actionStart', '>', 0)
    .where('actionEnd', '>', 0)
    .where('creationDate', '>=', dat2)
    .where('creationDate', '<', dat1)

  return latestActions
}

export interface actionTableType {
  id: number
  actionId: number
  actionStart: number
  actionEnd: number
  childId: number
  createdBy: number
  comment: string
  creationDate: Date
}

export const getStatisticTypes = async () => {
  const statisticTypes: statisticTypeTableType[] = await knex(statisticsTypeTableName)
    .select('id', 'statisticName')
    .orderBy('id', 'asc')
    .where({ isDeleted: null })

  return statisticTypes
}

interface statisticTypeTableType {
  id: number
  statisticName: string
}

export const getStatisticById = async (incrementedStatisticId: number) => {
  const action: actionTableType[] = await knex(actionTableName)
    .select()
    .orderBy('id', 'asc')
    .where({ isDeleted: null, id: incrementedStatisticId })

  return action
}

export const isTheRequesterAccountBelongsToTheStatistic = async (incrementedStatisticId: number, accountId: number) => {
  let action: actionTableType[] = await knex(actionTableName)
    .select()
    .orderBy('id', 'asc')
    .where({ isDeleted: null, id: incrementedStatisticId })

  if (!action || !action?.length) throwGlobalError('Database Error Yolo!!!', 500)
  const { childId } = action[0]

  return isTheChildBelongsToTheAccountId(childId, accountId)
}

export const updateStatistic = async (id: number, actionStart: number, actionEnd: number, comment: string = '') => {
  const updateResponse = await knex(actionTableName)
    .where({ id: id, isDeleted: null })
    .update({ actionStart, actionEnd, comment })

  return updateResponse
}

export const deleteStatistic = async (actionId: number) => {
  const updateResponse = await knex(actionTableName)
    .where({ id: actionId, isDeleted: null })
    .update({ isDeleted: true })

  return updateResponse
}
