import { Knex } from 'knex'

const tableName = 'groupIdEnum'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tableName).truncate()

  // Inserts seed entries
  await knex(tableName).insert([
    {
      name: 'Super Admin',
    },
    {
      name: 'Admin',
    },
    {
      name: 'User',
    },
    {
      name: 'Sub User',
    },
  ])
}
