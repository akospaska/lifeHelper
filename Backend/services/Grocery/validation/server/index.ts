import Joi from 'joi'

console.log({
  client: process.env.GROCERY_SQL_CLIENT,
  connection: {
    host: process.env.GROCERY_SQL_HOST,
    port: process.env.GROCERY_SQL_PORT,
    user: process.env.GROCERY_SQL_USER,
    password: process.env.GROCERY_SQL_PASSWORD,
    database: process.env.GROCERY_SQL_DATABASE,
  },
})

const serverVariablesSchema = Joi.object().keys({
  port: Joi.required(),
  host: Joi.required(),
  rabbitMqHost: Joi.required(),
})

export const validatedServerVariablesSchema: serverVariables = Joi.attempt(
  {
    port: process.env.GROCERY_PORT,
    host: process.env.GROCERY_HOST,
    rabbitMqHost: process.env.RABBITMQ_HOST,
  },
  serverVariablesSchema
)

interface serverVariables {
  port: string
  host: string
  rabbitMqHost: string
}

interface mysqlEnvironmentariables {
  client: string
  connection: {
    host: string
    port: string
    user: string
    password: string
    database: string
  }
}

const sqlEnvironmentVariablesSchema = Joi.object().keys({
  client: Joi.required(),
  connection: {
    host: Joi.required(),
    port: Joi.required(),
    user: Joi.required(),
    password: Joi.required(),
    database: Joi.required(),
  },
})

export const validatedSqlConnectionVariables: mysqlEnvironmentariables = Joi.attempt(
  {
    client: process.env.GROCERY_SQL_CLIENT,
    connection: {
      host: process.env.GROCERY_SQL_HOST,
      port: process.env.GROCERY_SQL_PORT,
      user: process.env.GROCERY_SQL_USER,
      password: process.env.GROCERY_SQL_PASSWORD,
      database: process.env.GROCERY_SQL_DATABASE,
    },
  },
  sqlEnvironmentVariablesSchema
)
