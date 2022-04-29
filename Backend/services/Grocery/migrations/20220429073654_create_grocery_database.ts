import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw('create database grocery')
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('drop database grocery')
}
