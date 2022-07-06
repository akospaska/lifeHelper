import { knex } from '../../databases/sql'

const childConnectTableName = 'parentConnect'

const isTheAccountIdBelongsToAparent = async (accountId: number) => {
  const searchResult1 = await knex(childConnectTableName)
    .limit(1)
    .select()
    .orderBy('creationDate', 'desc')
    .where({ parent1: accountId })

  return true
}
