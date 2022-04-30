import { Knex } from 'knex'

const groupConnectTableName = 'groupConnect'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(groupConnectTableName, function (table) {
    table.increments()
    table.integer('accountId').notNullable()
    table.integer('groupId').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(groupConnectTableName)
}
