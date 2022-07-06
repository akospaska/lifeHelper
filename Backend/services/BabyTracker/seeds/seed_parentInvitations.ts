import { Knex } from 'knex'

const parentInvitationTableName = 'parentInvitation'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(parentInvitationTableName).truncate()
  // Inserts seed entries
  await knex(parentInvitationTableName).insert([{ createdBy: 10, invited: 11 }])
}
