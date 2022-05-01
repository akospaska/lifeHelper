import { Knex } from 'knex'

import { sha512 } from 'js-sha512'

export const stringToSHA512 = (password: string): string => {
  //transform the input value into a sha512 hashed string
  return sha512(password)
}

const passwordSaltKey = 'pacal'

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
  ])
}
