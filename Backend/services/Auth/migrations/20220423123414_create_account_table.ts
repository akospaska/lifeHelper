import { Knex } from 'knex'

const accountTableName = 'account'

const accountGroupIdEnumTableName = 'groupIdEnum'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(accountTableName, function (table) {
    table.increments()
    table.string('email').notNullable()
    table.string('password').notNullable()
    table.integer('createdBy').notNullable()
    table.boolean('isAdmin').notNullable().defaultTo(false)
    table.integer('groupId').notNullable().defaultTo(0)
    table.boolean('isDeleted').defaultTo(null)
    table.boolean('isConfirmed').defaultTo(false)
    table.timestamp('creationDate').notNullable().defaultTo(knex.fn.now())
  })

  await knex.schema.createTable(accountGroupIdEnumTableName, function (table) {
    table.increments()
    table.string('name').notNullable()
    table.timestamp('creationDate').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(accountTableName)
  await knex.schema.dropTableIfExists(accountGroupIdEnumTableName)
}
