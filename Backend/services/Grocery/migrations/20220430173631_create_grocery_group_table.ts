import { Knex } from 'knex'

const groceryGroupTableName = 'groceryGroup'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(groceryGroupTableName, function (table) {
    table.increments()
    table.string('groceryGroupName').notNullable()
    table.integer('createdBy').notNullable(), table.boolean('isDeleted').defaultTo(null)
    table.timestamp('creationDate').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(groceryGroupTableName)
}
