import { knex } from '../../databases/sql'
import { isTheactionOnRecording } from '../../facade/actions'

import { unlockTablesWrite, lockTableWrite } from '../../databases/sql'
import { getDateNowTimestampInSeconds } from '../../utils/Time'

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
    .select('actionId', 'actionStart', 'actionEnd')
    .orderBy('creationDate', 'desc')
    .where({ actionId: actionId, childId: childId })

  if (lastActionArray.length === 0) return { actionId: actionId, actionStart: null, actionEnd: null }

  return lastActionArray[0]
}

interface actionType {
  actionId: number
  actionStart: number | null
  actionEnd: number | null
}

export const isTheActionInRecording = async (actionId: number, childId: number) => {
  const latestActionByActionId = await getLatestActionByActionId(actionId, childId)
  return isTheactionOnRecording(latestActionByActionId)
}

export const startRecordingAutomatically = async (actionId: number, childId: number, accountId: number) => {
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
