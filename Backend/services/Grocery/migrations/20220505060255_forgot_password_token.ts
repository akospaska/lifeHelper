import { Knex } from 'knex'

const forgotPasswordTableName = 'forgotPasswordRequest'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(forgotPasswordTableName, function (table) {
    table.increments()
    table.integer('accountId').notNullable()
    table.string('forgotPasswordToken').notNullable()
    table.boolean('isConfirmed').defaultTo(false)
    table.timestamp('creationDate').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(forgotPasswordTableName)
}
