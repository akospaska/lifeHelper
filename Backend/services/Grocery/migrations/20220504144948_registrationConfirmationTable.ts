import { Knex } from 'knex'

const accountTableName = 'registerConfirmation'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(accountTableName, function (table) {
    table.increments()
    table.integer('accountId').notNullable()
    table.string('confirmationToken').notNullable()
    table.boolean('isConfirmed').defaultTo(false)
    table.timestamp('creationDate').notNullable().defaultTo(knex.fn.now())
  })

  console.log('TABLE CREATED')
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(accountTableName)
}
