import { knex } from '../../databases/sql'

const childConnectTableName = 'parentConnect'
const parentInvitationTableName = 'parentInvitation'

export const isTheAccountIdBelongsToAparent = async (accountId: number) => {
  const searchResult1 = await knex(childConnectTableName)
    .select()
    .orderBy('creationDate', 'desc')
    .where({ parent1: accountId })

  if (searchResult1.length > 0) return true

  const searchResult2 = await knex(childConnectTableName)
    .select()
    .orderBy('creationDate', 'desc')
    .where({ parent2: accountId })

  if (searchResult2.length > 0) return true

  return false
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

export interface parentInvitationTableType {
  id: number
  createdBy: number
  invited: number
  isAccepted: boolean
  isAnswered: boolean
  isDeleted: boolean
  creationDate: string
}
