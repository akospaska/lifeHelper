import { isTheChildBelongsToTheAccountId } from '../../dataAccessLayer/children'
import { deleteWeight, getLatestChildWeights, insertNewChildWeight, updateWeight } from '../../dataAccessLayer/childWeight'
import { throwGlobalError } from '../../utils/errorHandling'

export const getChildWeights = async (accountId: number, childId: number, pagerStart: number, pagerEnd: number) => {
  await isTheChildBelongsToTheAccountId(childId, accountId)
  return getLatestChildWeights(childId, pagerStart, pagerEnd)
}

export const insertChildWeight = async (childId: number, weight: number, comment: string = '', creationDate: number = Date.now(), accountId: number) => {
  await isTheChildBelongsToTheAccountId(childId, accountId)

  const newInsertResult = await insertNewChildWeight(childId, weight, comment, creationDate, accountId)

  if (newInsertResult.length > 1 || newInsertResult.length === 0) {
    throwGlobalError('Bad Request', 400)
  }

  return { isValid: true }
}

export const updateChildWeight = async (weightId: number, weight: number, childId: number, comment: string = '', creationDate: number, accountId: number) => {
  await isTheChildBelongsToTheAccountId(childId, accountId)
  const updateResult = await updateWeight(weightId, weight, childId, comment, creationDate)

  if (updateResult > 1) throwGlobalError('Oppsy, Call the Sys Admin Now!!44!', 500)

  if (updateResult != 1) throwGlobalError('Oppsy, something gone wrong!', 400)

  return { isValid: true }
}

export const deleteChildWeight = async (weightId: number, childId: number, accountId: number) => {
  await isTheChildBelongsToTheAccountId(childId, accountId)

  const deleteResult = await deleteWeight(weightId, childId)

  if (deleteResult > 1) throwGlobalError('Oppsy, Call the Sys Admin Now!!44!', 500)
  if (deleteResult != 1) throwGlobalError('Oppsy, something gone wrong!', 400)

  return { isValid: true }
}
