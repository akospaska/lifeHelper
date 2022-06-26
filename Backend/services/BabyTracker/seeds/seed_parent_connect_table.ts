import { Knex } from 'knex'

const parentConnectTableName = 'parentConnect'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(parentConnectTableName).truncate()

  // Inserts seed entries
  await knex(parentConnectTableName).insert([
    { parent1: 31, parent2: 1 },
    { parent1: 4, parent2: 2 },
    { parent1: 5, parent2: 6 },
  ])
}
