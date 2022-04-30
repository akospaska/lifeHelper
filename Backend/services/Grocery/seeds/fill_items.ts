import { Knex } from 'knex'

const groceryItemTableName = 'groceryItem'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(groceryItemTableName).del()

  // Inserts seed entries
  await knex(groceryItemTableName).insert([
    { name: 'item1', categoryId: 1, createdBy: 1 },
    { name: 'item2', categoryId: 1, createdBy: 1 },
    { name: 'item3', categoryId: 1, createdBy: 1 },
    { name: 'item4', categoryId: 1, createdBy: 1 },
    { name: 'item5', categoryId: 2, createdBy: 1 },
    { name: 'item3', categoryId: 2, createdBy: 1 },
    { name: 'item4', categoryId: 3, createdBy: 1 },
    { name: 'item5', categoryId: 4, createdBy: 1 },
  ])
}
