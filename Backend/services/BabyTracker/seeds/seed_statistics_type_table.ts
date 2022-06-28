import { Knex } from 'knex'

const statisticsTypeTableName = 'statisticsType'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(statisticsTypeTableName).truncate()

  // Inserts seed entries
  await knex(statisticsTypeTableName).insert([{ statisticName: 'Latest Actions' }])
}
