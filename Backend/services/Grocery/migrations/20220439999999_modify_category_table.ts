import { Knex } from 'knex'

const groceryCategoriesName = 'groceryCategories'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table(groceryCategoriesName, (table) => {
    table.string('icon', 128)
  })
}

exports.down = function (knex) {
  return knex.schema.table(groceryCategoriesName, (table) => {
    table.dropColumn('icon')
  })
}
