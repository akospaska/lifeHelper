import { Knex } from 'knex'

const statisticsTypeTableName = 'statisticsType'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(statisticsTypeTableName, function (table) {
    table.increments()
    table.string('statisticName').notNullable()
    table.boolean('isDeleted').defaultTo(null)
    table.timestamp('creationDate').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(statisticsTypeTableName)
}
