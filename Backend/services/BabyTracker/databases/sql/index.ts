import { validatedSqlConnectionVariables } from '../../validation/server'

export let knex

//Connect sql service with validated sql server details
export const sqlInit = async () => {
  knex = await require('knex')(validatedSqlConnectionVariables)
  await testSqlConnection()
}

export const sqlClose = async () => {
  await knex.destroy()
  console.log('Sql connection closed')
}

export const migrateBabyTrackerDatabase = async () => {
  await await knex.migrate.latest()
  console.log('BabyTracker DB migrations done!')
}

export const seedBabyTrackerDatabase = async () => {
  await knex.seed.run()

  console.log('Baby tracker DB seeding done!')
}

export const prepareDbForTests = async () => {
  await migrateBabyTrackerDatabase()
  await seedBabyTrackerDatabase()
  console.log('DB is prepared for tests!')
}

if (process.env.NODE_ENV === 'prd') {
  const cron = require('node-cron')

  cron.schedule('1 * * * * *', async () => {
    if (knex) {
      console.log('Keep mysql connection alive')
      console.log(await knex.raw('SELECT 1'))
    }
  })
}

export const testSqlConnection = async () => {
  try {
    await knex.raw('SELECT 1')

    console.log('Mysql connected')
  } catch (err) {
    console.log('Mysql not connected')
    console.error(err)
    throw err
  }
}

export const lockTableWrite = async (tableName: string) => {
  await knex.raw(`LOCK TABLES ${tableName} WRITE;`)
  console.log('Table locked!')
}

export const unlockTablesWrite = async () => {
  await knex.raw(`UNLOCK TABLES;`)
  console.log('Tables unlocked!')
}
