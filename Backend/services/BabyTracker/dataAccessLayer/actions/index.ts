import { knex } from '../../databases/sql'
import { isTheactionOnRecording } from '../../facade/actions'

import { getDateNowTimestampInSeconds } from '../../utils/Time'
import { throwGlobalError } from '../../utils/errorHandling'
import { Knex } from 'knex'

import { isTheChildBelongsToTheAccountId } from '../children'

import { actionTableType } from '../statistics/statistics'

const actionTableName = 'action'
const actionEnumTableName = 'actionEnum'

//actionIdEnums
/*
1 { actionName: 'Sleep' },
2 { actionName: 'BrestFeed' },
3 { actionName: 'Walk' },
4 { actionName: 'Falling asleep' },
5 { actionName: 'Eat' },
*/

export const getActionStatuses = async (childId: number) => {
  const actionTypes = await getActionTypes()

  let result = []

  await Promise.all(
    actionTypes.map(async (a) => {
      let tempObj = {}
      result.push((tempObj[a.actionName] = await getLatestActionByActionId(a.id, childId, a.actionName)))
    })
  )

  result.sort((a, b) => {
    return a.actionId - b.actionId
  })

  return result
}

const getLatestActionByActionId = async (actionId: number, childId: number, actionName: string) => {
  const lastActionArray: actionType[] = await knex(actionTableName)
    .join('actionEnum', 'actionEnum.id', 'action.actionId')
    .limit(1)
    .select('action.id', 'actionId', 'actionStart', 'actionEnd', 'actionName')
    .orderBy('action.creationDate', 'desc')
    .where({ actionId: actionId, childId: childId })

  if (lastActionArray.length === 0)
    return {
      id: null,
      actionId: actionId,
      actionStart: null,
      actionEnd: null,
      isRecording: false,
      actionName: actionName,
    }

  const result = lastActionArray[0]
  result.isRecording = result.actionStart && !result.actionEnd

  return result
}

interface actionType {
  id: number
  actionId: number
  actionStart: number | null
  actionEnd: number | null
  isRecording: boolean
}

export const isTheActionInRecording = async (actionId: number, childId: number) => {
  const latestActionByActionId = await getLatestActionByActionId(actionId, childId, '')

  return isTheactionOnRecording(latestActionByActionId)
}

export const getActionTypes = async () => {
  const actionTypes: actionEnumType[] = await knex(actionEnumTableName).select()

  return actionTypes
}

interface actionEnumType {
  id: number
  actionName: string
}

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(actionEnumTableName, function (table) {
    table.increments()
    table.string('actionName').notNullable()
    table.boolean('isDeleted').defaultTo(null)
    table.timestamp('creationDate').notNullable().defaultTo(knex.fn.now())
  })
}

export const startRecordingAutomatically = async (actionId: number, childId: number, accountId: number) => {
  const sqlInsertResult: number[] = await knex(actionTableName).insert({
    actionId: actionId,
    actionStart: getDateNowTimestampInSeconds(),
    childId: childId,
    createdBy: accountId,
  })

  return sqlInsertResult[0]
}

export const startRecordingManually = async (
  actionId: number,
  childId: number,
  accountId: number,
  actionStart: number,
  actionEnd: number,
  comment: string | undefined
) => {
  const newActionIds: number[] = await knex(actionTableName).insert({
    actionId,
    actionStart,
    actionEnd,
    childId,
    createdBy: accountId,
    comment,
  })

  if (newActionIds?.length > 1) throwGlobalError('Ooopsy, Call the Sys Admins!!44!!!', 500)

  if (!newActionIds) throwGlobalError('Databse Error Yolo!!', 500)

  return newActionIds[0]
}

export const getActionByIncrementedActionId = async (incrementedActionId: number, childId: number) => {
  const searchedAction: actionType[] = await knex(actionTableName)
    .limit(1)
    .select('id', 'actionId', 'actionStart', 'actionEnd')
    .orderBy('creationDate', 'desc')
    .where({ id: incrementedActionId, childId: childId })

  return searchedAction[0]
}

export const isTheActionRecordingByIncrementedActionId = async (incrementedActionId: number, childId: number) => {
  const searchResult = await getActionByIncrementedActionId(incrementedActionId, childId)

  //If the searchResult is undefined, it means the incrementedActionId not belongs to the child and to the parent => throw an error
  if (!searchResult) throwGlobalError('Access Denied!', 403)
  return searchResult?.actionEnd ? false : true
}

export const stopActionRecording = async (incrementedActionId: number) => {
  const updateResponse = await knex(actionTableName)
    .where({ id: incrementedActionId })
    .update({ actionEnd: getDateNowTimestampInSeconds() })

  return updateResponse
}

export const getActionById = async (incrementedStatisticId: number) => {
  const action: actionTableType[] = await knex(actionTableName)
    .select()
    .orderBy('id', 'asc')
    .where({ isDeleted: null, id: incrementedStatisticId })

  return action
}

export const isTheRequesterAccountBelongsToTheAction = async (incrementedStatisticId: number, accountId: number) => {
  const action: actionTableType[] = await knex(actionTableName)
    .select()
    .orderBy('id', 'asc')
    .where({ isDeleted: null, id: incrementedStatisticId })

  console.log(action)
  if (!action) throwGlobalError('Database Error Yolo!!!', 500)

  if (action?.length === 0) throwGlobalError('Access Denied!', 403)

  const { childId } = action[0]

  const isTheChildBelongsToTheAccount = await isTheChildBelongsToTheAccountId(childId, accountId)

  if (!isTheChildBelongsToTheAccount) throwGlobalError('Access Denied!', 403)

  return true
}

export const updateAction = async (id: number, actionStart: number, actionEnd: number, comment: string = '') => {
  const updateResponse = await knex(actionTableName)
    .where({ id: id, isDeleted: null })
    .update({ actionStart, actionEnd, comment })

  if (updateResponse > 1) throwGlobalError('Oppsy, Call the Sys Admin Now!!44!', 500)

  if (updateResponse != 1) throwGlobalError('Oppsy, something gone wrong!', 400)

  return true
}

export const deleteAction = async (actionId: number) => {
  const updateResponse: number = await knex(actionTableName)
    .where({ id: actionId, isDeleted: null })
    .update({ isDeleted: true })

  if (updateResponse > 1) throwGlobalError('Oppsy, Call the Sys Admin Now!!44!', 500)
  if (updateResponse != 1) throwGlobalError('Oppsy, something gone wrong!', 400)

  return true
}
