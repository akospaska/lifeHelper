import { Knex } from 'knex'

const groceryCategoriesTableName = 'groceryCategories'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(groceryCategoriesTableName).del()

  // Inserts seed entries
  await knex(groceryCategoriesTableName).insert([
    { name: 'category1', createdBy: 1, groupId: 1, priority: 1 },
    { name: 'category2', createdBy: 1, groupId: 1, priority: 4 },
    { name: 'category3', createdBy: 1, groupId: 1, priority: 5 },
    { name: 'category4', createdBy: 1, groupId: 1, priority: 3 },
    { name: 'category5', createdBy: 1, groupId: 1, priority: 2 },
  ])
}
