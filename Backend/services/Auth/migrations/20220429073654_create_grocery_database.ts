import { Knex } from 'knex'

const groceryCategoriesName = 'groceryCategories'

const groceryItemTableName = 'groceryItem'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(groceryCategoriesName, function (table) {
    table.increments()
    table.string('name').notNullable()
    table.integer('createdBy').notNullable(),
      table.integer('groupId').notNullable(),
      table.integer('priority').notNullable(),
      table.boolean('isDeleted').defaultTo(null)
    table.timestamp('creationDate').notNullable().defaultTo(knex.fn.now())
  })

  await knex.schema.createTable(groceryItemTableName, function (table) {
    table.increments()
    table.string('name').notNullable()
    table.integer('createdBy').notNullable(),
      table.integer('categoryId').notNullable(),
      table.boolean('isDeleted').defaultTo(null),
      table.timestamp('creationDate').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(groceryCategoriesName)
  await knex.schema.dropTableIfExists(groceryItemTableName)
}
