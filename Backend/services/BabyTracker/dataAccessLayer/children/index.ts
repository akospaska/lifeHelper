import { knex } from '../../databases/sql'
import { throwGlobalError } from '../../utils/errorHandling'

const childTableName = 'child'
const parentConnectTableName = 'parentConnect'

export const isTheChildBelongsToTheAccountId = async (childId: number, accountId: number) => {
  const searchResult = await getChild(accountId, childId)

  const gotAccess = searchResult?.length > 0
  if (!gotAccess) throwGlobalError('Access Denied!', 403)

  return true
}

export const getChild = async (accountId: number, childId: number) => {
  const childFoundByCreatedTheAccountId = await knex(childTableName)
    .select()
    .orderBy('isDefault', 'desc')
    .where({ createdBy: accountId, isDeleted: null, id: childId })

  if (childFoundByCreatedTheAccountId.length > 0) return childFoundByCreatedTheAccountId

  const partnerAccountID = await getParentPartnerAccountId(accountId)

  if (!partnerAccountID) return null

  const childCreatedByPartner = await knex(childTableName)
    .select()
    .orderBy('isDefault', 'desc')
    .where({ createdBy: partnerAccountID, isDeleted: null, id: childId })

  return childCreatedByPartner ? childCreatedByPartner : null
}

export const getChildren = async (accountId: number) => {
  return <childTableType[]>(
    await knex(childTableName).select().orderBy('isDefault', 'desc').where({ createdBy: accountId, isDeleted: null })
  )
}

export interface childTableType {
  id: number
  name: string
  birthDate: number
  createdBy: number
  isDefault: boolean
  isDeleted: boolean
  creationDate: number
}

export const getParentPartnerAccountId = async (accountId: number) => {
  const parentPartnerSearch1: parentConnectTableType[] = await knex(parentConnectTableName)
    .select()
    .where({ parent2: accountId })

  if (parentPartnerSearch1.length > 0) {
    const { parent1 } = parentPartnerSearch1[0]
    return parent1
  }

  const parentPartnerSearch2: parentConnectTableType[] = await knex(parentConnectTableName)
    .select()
    .where({ parent1: accountId })

  if (parentPartnerSearch2.length > 0) {
    const { parent2 } = parentPartnerSearch2[0]
    return parent2
  }

  return 0
}

export const updateChild = async (childId: number, name: string, isDefault: boolean) => {
  const updateResult = await await knex(childTableName).where({ id: childId }).update({ name, isDefault })

  if (updateResult > 1) throwGlobalError('Oppsy, Call the Sys Admin Now!!44!', 500)

  if (updateResult != 1) throwGlobalError('Oppsy, something gone wrong!', 400)

  return true
}

export const removeChild = async (childId: number) => {
  const updateResult = await await knex(childTableName).where({ id: childId }).update({ isDeleted: true })

  if (updateResult > 1) throwGlobalError('Oppsy, Call the Sys Admin Now!!44!', 500)

  if (updateResult != 1) throwGlobalError('Oppsy, something gone wrong!', 400)

  return true
}
export const registerChild = async (createdBy: number, name: string) => {
  await knex(childTableName).insert({
    name: name,
    createdBy,
    birthDate: 1655959122,
  })
  return
}

interface parentConnectTableType {
  id: number
  parent1: number
  parent2: number
}

export interface childTableType {
  name: string
  birthDate: number
  createdBy: number
  isDefault: boolean
  isDeleted: boolean
  creationDate: number
}
