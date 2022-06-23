import { Knex } from 'knex'

const actionEnumTableNAme = 'actionEnum'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(actionEnumTableNAme, function (table) {
    table.increments()
    table.string('actionName').notNullable()
    table.boolean('isDeleted').defaultTo(null)
    table.timestamp('creationDate').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(actionEnumTableNAme)
}
