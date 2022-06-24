import { Knex } from 'knex'

const actionTableName = 'action'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(actionTableName, function (table) {
    table.increments()
    table.integer('actionId').notNullable()
    table.integer('actionStart').notNullable()
    table.integer('actionEnd')
    table.integer('childId').notNullable()
    table.integer('createdBy').notNullable()
    table.boolean('isDeleted').defaultTo(null)
    table.string('comment').defaultTo(null)
    table.timestamp('creationDate').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(actionTableName)
}
