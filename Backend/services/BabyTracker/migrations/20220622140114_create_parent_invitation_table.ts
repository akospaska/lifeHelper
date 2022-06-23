import { Knex } from 'knex'

const parentInvitationTableName = 'parentInvitation'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(parentInvitationTableName, function (table) {
    table.increments()
    table.integer('createdBy').notNullable()
    table.integer('invited').notNullable()
    table.boolean('isAccepted').notNullable().defaultTo(false)
    table.boolean('isAnswered').notNullable().defaultTo(false)
    table.boolean('isDeleted').defaultTo(null)
    table.timestamp('creationDate').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(parentInvitationTableName)
}
