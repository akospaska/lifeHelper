import { Knex } from 'knex'

const groceryGroupTableName = 'groceryGroup'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(groceryGroupTableName).truncate()

  // Inserts seed entries
  await knex(groceryGroupTableName).insert([
    { groceryGroupName: 'GroupName1', createdBy: 1 },
    { groceryGroupName: 'GroupName2', createdBy: 1 },
    { groceryGroupName: 'GroupName3', createdBy: 2 },
    { groceryGroupName: 'GroupName4', createdBy: 1 },
    { groceryGroupName: 'GroupName5', createdBy: 2 },
  ])
}
