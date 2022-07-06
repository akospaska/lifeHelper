import { knex } from '../../databases/sql'

const childConnectTableName = 'parentConnect'

export const isTheAccountIdBelongsToAparent = async (accountId: number) => {
  const searchResult1 = await knex(childConnectTableName)
    .limit(1)
    .select()
    .orderBy('creationDate', 'desc')
    .where({ parent1: accountId })

  if (searchResult1.length > 0) return true

  const searchResult2 = await knex(childConnectTableName)
    .limit(1)
    .select()
    .orderBy('creationDate', 'desc')
    .where({ parent2: accountId })

  if (searchResult2.length > 0) return true

  return false
}
