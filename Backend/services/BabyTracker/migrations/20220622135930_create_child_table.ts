import { Knex } from 'knex'

const childTableName = 'child'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(childTableName, function (table) {
    table.increments()
    table.string('name').notNullable()
    table.integer('birthDate').notNullable()
    table.integer('createdBy').notNullable()
    table.boolean('isDefault').notNullable().defaultTo(false)
    table.boolean('isDeleted').defaultTo(null)
    table.timestamp('creationDate').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(childTableName)
}
