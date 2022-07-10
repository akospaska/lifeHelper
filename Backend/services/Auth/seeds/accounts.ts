import { Knex } from 'knex'
import { stringToSHA512 } from '../web/tools/encryption'
import { validatedWebProcessServerVariables } from '../web/validation/server'

const { passwordSaltKey } = validatedWebProcessServerVariables

const tableName = 'account'
const password = 'pacal'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tableName).truncate()

  // Inserts seed entries
  await knex(tableName).insert([
    {
      email: 'akospaska@gmail.com',
      password: stringToSHA512(passwordSaltKey + password),
      createdBy: 1,
      groupId: 1,
      isAdmin: true,
      isConfirmed: true,
    },
    {
      email: 'email@email.com',
      password: stringToSHA512(passwordSaltKey + password),
      createdBy: 1,
      groupId: 1,
      isAdmin: false,
    },
    {
      email: 'hokamoka@hokamoka.com',
      password: stringToSHA512(passwordSaltKey + password),
      createdBy: 1,
      groupId: 1,
      isAdmin: false,
    },

    {
      email: 'akosparent1@gmail.com',
      password: stringToSHA512(passwordSaltKey + password),
      createdBy: 1,
      groupId: 1,
      isAdmin: false,
      isConfirmed: true,
    },

    {
      email: 'akosparent2@gmail.com',
      password: stringToSHA512(passwordSaltKey + password),
      createdBy: 1,
      groupId: 1,
      isAdmin: false,
      isConfirmed: true,
    },
  ])
}
