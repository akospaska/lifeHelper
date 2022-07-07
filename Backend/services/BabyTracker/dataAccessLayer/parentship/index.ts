import { number } from 'joi'
import { knex } from '../../databases/sql'
import { throwGlobalError } from '../../utils/errorHandling'

const parentConnectTableName = 'parentConnect'

const parentInvitationTableName = 'parentInvitation'

export const isTheAccountIdBelongsToAparent = async (accountId: number) => {
  const searchResult1 = await knex(parentConnectTableName)
    .select()
    .orderBy('creationDate', 'desc')
    .where({ parent1: accountId })

  if (searchResult1.length > 0) return true

  const searchResult2 = await knex(parentConnectTableName)
    .select()
    .orderBy('creationDate', 'desc')
    .where({ parent2: accountId })

  if (searchResult2.length > 0) return true

  return false
}

export const isTheInvitationBelongsToTheAccountId = async (accountId: number, invitationId: number) => {
  const searchResult: parentInvitationTableType[] = await knex(parentInvitationTableName)
    .select('id', 'createdBy', 'invited', 'isAccepted', 'isAnswered')
    .where({ id: invitationId, invited: accountId, isAccepted: false, isAnswered: false, isDeleted: null })

  const searchResult2: parentInvitationTableType[] = await knex(parentInvitationTableName)
    .select('id', 'createdBy', 'invited', 'isAccepted', 'isAnswered')
    .where({ id: invitationId, createdBy: accountId, isAccepted: false, isAnswered: false, isDeleted: null })

  if (searchResult.length > 0 || searchResult2.length > 0) return true

  throwGlobalError('Invitation not found!', 403)
}

export const checkIsTheInvitationSendIsPossible = async (accountId: number, consigneeId: number) => {
  const searchResult = await isTheAccountIdBelongsToAparent(accountId)
  console.log('searchResult')
  console.log(searchResult)

  const searchResult2 = await isTheAccountIdBelongsToAparent(consigneeId)
  console.log('searchResult2')
  console.log(searchResult2)

  if (searchResult) throwGlobalError('The requester already has a parent', 403)

  if (searchResult2) throwGlobalError('The consignee already has a partner', 403)

  return true
}

export const checkParentInvitationsStatus = async (accountId: number) => {
  const accountIdInvited: parentInvitationTableType[] = await knex(parentInvitationTableName)
    .select('id', 'createdBy', 'invited', 'isAccepted', 'isAnswered')
    .where({ invited: accountId, isAccepted: false, isAnswered: false, isDeleted: null })

  const invitedByTheAccountId: parentInvitationTableType[] = await knex(parentInvitationTableName)
    .select('id', 'createdBy', 'invited', 'isAccepted', 'isAnswered')
    .where({ createdBy: accountId, isAccepted: false, isAnswered: false, isDeleted: null })

  const responseBody = { invitationsReceived: accountIdInvited, invited: invitedByTheAccountId }

  return responseBody
}

export const checkIsTheInvitationAlreadySent = async (accountId: number, consigneeId: number) => {
  const accountIdInvited: parentInvitationTableType[] = await knex(parentInvitationTableName)
    .select('id', 'createdBy', 'invited', 'isAccepted', 'isAnswered')
    .where({ createdBy: accountId, invited: consigneeId, isAccepted: false, isAnswered: false, isDeleted: null })

  const invitedByTheAccountId: parentInvitationTableType[] = await knex(parentInvitationTableName)
    .select('id', 'createdBy', 'invited', 'isAccepted', 'isAnswered')
    .where({ createdBy: consigneeId, invited: accountId, isAccepted: false, isAnswered: false, isDeleted: null })

  if (accountIdInvited.length > 0 || invitedByTheAccountId.length > 0)
    throwGlobalError('Invitation is already pending!', 403)

  return true
}

export interface parentInvitationTableType {
  id: number
  createdBy: number
  invited: number
  isAccepted: boolean
  isAnswered: boolean
  isDeleted: boolean
  creationDate: string
}

export const getInvitation = async (accountId: number, invitationId: number) => {
  const searchResult: parentInvitationTableType[] = await knex(parentInvitationTableName)
    .select('id', 'createdBy', 'invited', 'isAccepted', 'isAnswered')
    .where({ id: invitationId, invited: accountId, isAccepted: false, isAnswered: false, isDeleted: null })

  if (searchResult.length < 1) throwGlobalError('Invitation not found', 404)

  return searchResult[0]
}

export const getSentInvitation = async (accountId: number, invitationId: number) => {
  const searchResult: parentInvitationTableType[] = await knex(parentInvitationTableName)
    .select('id', 'createdBy', 'invited', 'isAccepted', 'isAnswered')
    .where({ id: invitationId, createdBy: accountId, isAccepted: false, isAnswered: false, isDeleted: null })

  if (searchResult.length < 1) throwGlobalError('Invitation not found', 404)

  return searchResult[0]
}

export const acceptInvitation = async (accountId: number, invitationId: number) => {
  const updatedRows: number = await knex(parentInvitationTableName)
    .where({ id: invitationId, invited: accountId, isAccepted: false, isAnswered: false, isDeleted: null })
    .update({ isAccepted: true, isAnswered: true })

  if (updatedRows !== 1) throwGlobalError('Database Error', 500)

  return
}

export const declineInvitation = async (invitationId: number) => {
  const updatedRows: number = await knex(parentInvitationTableName)
    .where({ id: invitationId, isAccepted: false, isAnswered: false, isDeleted: null })
    .update({ isDeleted: true, isAnswered: true })

  if (updatedRows !== 1) throwGlobalError('Database Error', 500)

  return
}

export const insertNewParentsToConnectTable = async (inviter: number, invited: number) => {
  const insertResult: number[] = await knex(parentConnectTableName).insert([{ parent1: inviter, parent2: invited }])

  if (insertResult.length > 1 || insertResult.length === 0) throwGlobalError('Database Error', 500)
  return
}

export const deleteAllThePendingInvitations = async (inviterId: number, invitedId: number) => {
  const searchResult: parentInvitationTableType[] = await knex(parentInvitationTableName)
    .select('id', 'createdBy', 'invited', 'isAccepted', 'isAnswered')
    .where({ invited: invitedId, isAccepted: false, isAnswered: false, isDeleted: null })

  const searchResult2: parentInvitationTableType[] = await knex(parentInvitationTableName)
    .select('id', 'createdBy', 'invited', 'isAccepted', 'isAnswered')
    .where({ createdBy: invitedId, isAccepted: false, isAnswered: false, isDeleted: null })

  const searchResult3: parentInvitationTableType[] = await knex(parentInvitationTableName)
    .select('id', 'createdBy', 'invited', 'isAccepted', 'isAnswered')
    .where({ createdBy: inviterId, isAccepted: false, isAnswered: false, isDeleted: null })

  const searchResult4: parentInvitationTableType[] = await knex(parentInvitationTableName)
    .select('id', 'createdBy', 'invited', 'isAccepted', 'isAnswered')
    .where({ invited: inviterId, isAccepted: false, isAnswered: false, isDeleted: null })

  const mergedArray = searchResult.concat(searchResult2, searchResult3, searchResult4)

  mergedArray.forEach(async (element) => {
    await deleteInvitationByInvitationId(element.id)
  })

  return
}

const deleteInvitationByInvitationId = async (invitationId: number) => {
  const updatedRows: number = await knex(parentInvitationTableName)
    .where({ id: invitationId })
    .update({ isDeleted: true })

  return updatedRows
}

export const insertNewInvitation = async (inviter: number, invited: number) => {
  const insertResult: number[] = await knex(parentInvitationTableName).insert([
    { createdBy: inviter, invited: invited },
  ])

  if (insertResult.length > 1 || insertResult.length === 0) throwGlobalError('Database Error', 500)
  return
}
