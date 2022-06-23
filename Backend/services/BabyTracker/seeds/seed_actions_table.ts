import { Knex } from 'knex'

const actionTableName = 'action'
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(actionTableName).truncate()

  // Inserts seed entries
  await knex(actionTableName).insert([
    {
      actionId: 1,
      actionStart: Math.round(Date.now() / 1000 - 900),
      actionEnd: null,
      childId: 1,
      createdBy: 3,
    },
    {
      actionId: 2,
      actionStart: Math.round(Date.now() / 1000 - 1600),
      actionEnd: Math.round(Date.now() / 1000 - 1400),
      childId: 1,
      createdBy: 3,
    },
    {
      actionId: 3,
      actionStart: Math.round(Date.now() / 1000 - 1300),
      actionEnd: Math.round(Date.now() / 1000 - 1000),
      childId: 1,
      createdBy: 3,
    },
  ])
}
