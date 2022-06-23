import { Knex } from 'knex'

const parentConnectTableName = 'parentConnect'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(parentConnectTableName).del()

  // Inserts seed entries
  await knex(parentConnectTableName).insert([
    { parent1: 3, parent2: 1 },
    { parent1: 4, parent2: 2 },
  ])
}
