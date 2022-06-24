import { knex } from '../../databases/sql'
import { isTheactionOnRecording } from '../../facade/actions'

import { unlockTablesWrite, lockTableWrite } from '../../databases/sql'
import { getDateNowTimestampInSeconds } from '../../utils/Time'
import { throwGlobalError } from '../../utils/errorHandling'

const actionTableName = 'action'

//actionIdEnums
/*
1 { actionName: 'Sleep' },
2 { actionName: 'BrestFeed' },
3 { actionName: 'Walk' },
4 { actionName: 'Falling asleep' },
5 { actionName: 'Eat' },
*/

export const getActionStatuses = async (childId: number) => {
  const result = {
    sleep: await getLatestActionByActionId(1, childId),
    brestFeed: await getLatestActionByActionId(2, childId),
    walk: await getLatestActionByActionId(3, childId),
    fallingAsleep: await getLatestActionByActionId(4, childId),
    eat: await getLatestActionByActionId(5, childId),
  }

  return result
}

const getLatestActionByActionId = async (actionId: number, childId: number) => {
  const lastActionArray: actionType[] = await knex(actionTableName)
    .limit(1)
    .select('id', 'actionId', 'actionStart', 'actionEnd')
    .orderBy('creationDate', 'desc')
    .where({ actionId: actionId, childId: childId })

  if (lastActionArray.length === 0) return { id: null, actionId: actionId, actionStart: null, actionEnd: null }

  return lastActionArray[0]
}

interface actionType {
  id: number
  actionId: number
  actionStart: number | null
  actionEnd: number | null
}

export const isTheActionInRecording = async (actionId: number, childId: number) => {
  const latestActionByActionId = await getLatestActionByActionId(actionId, childId)

  return isTheactionOnRecording(latestActionByActionId)
}

export const startRecordingAutomatically = async (actionId: number, childId: number, accountId: number) => {
  //prevent the paralell action records
  await lockTableWrite(actionTableName)

  const sqlInsertResult: number[] = await knex(actionTableName).insert({
    actionId: actionId,
    actionStart: getDateNowTimestampInSeconds(),
    childId: childId,
    createdBy: accountId,
  })
  await unlockTablesWrite()

  return sqlInsertResult[0]
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
