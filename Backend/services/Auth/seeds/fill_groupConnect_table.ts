import { Knex } from 'knex'

const groupConnectTableName = 'groupConnect'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(groupConnectTableName).truncate()

  // Inserts seed entries
  await knex(groupConnectTableName).insert([
    { accountId: 1, groupId: 1 },
    { accountId: 1, groupId: 2 },
    { accountId: 1, groupId: 4 },
    { accountId: 2, groupId: 3 },
    { accountId: 2, groupId: 5 },
  ])
}
