import { Knex } from 'knex'

const actionEnumTableNAme = 'actionEnum'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(actionEnumTableNAme).del()

  // Inserts seed entries
  await knex(actionEnumTableNAme).insert([
    { actionName: 'Sleep' },
    { actionName: 'BrestFeed' },
    { actionName: 'Walk' },
    { actionName: 'Falling asleep' },
    { actionName: 'Eat' },
  ])
}
