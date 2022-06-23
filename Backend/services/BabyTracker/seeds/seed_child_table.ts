import { Knex } from 'knex'

const childTableName = 'child'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(childTableName).del()

  // Inserts seed entries
  await knex(childTableName).insert([
    { name: 'test_child1', birthDate: 1655959122, createdBy: 1 },
    { name: 'test_child2', birthDate: 1655959122, createdBy: 2 },
    { name: 'test_child3', birthDate: 1655959122, createdBy: 3 },
  ])
}