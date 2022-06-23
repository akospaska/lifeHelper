import { Knex } from 'knex'

const childConnectTableName = 'parentConnect'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(childConnectTableName, function (table) {
    table.increments()
    table.integer('parent1').notNullable()
    table.integer('parent2').notNullable()
    table.timestamp('creationDate').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(childConnectTableName)
}
