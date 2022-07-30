import { Knex } from 'knex'

const childWeightTableName = 'childWeight'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(childWeightTableName, function (table) {
    table.increments()
    table.integer('childId').notNullable()
    table.integer('weight').notNullable()
    table.string('comment')
    table.integer('createdBy').notNullable()
    table.boolean('isDeleted').defaultTo(null)
    table.bigInteger('date').notNullable()
    table.timestamp('creationDate').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(childWeightTableName)
}
