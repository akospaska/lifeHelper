import Joi from 'joi'

const webProcessServerVariablesSchema = Joi.object().keys({
  port: Joi.required(),
  host: Joi.required(),
})

export const webProcessServerVariables = Joi.attempt(
  { port: process.env.PORT, host: process.env.HOST },
  webProcessServerVariablesSchema
)

interface webProcessServerVariables {
  port: string
  host: string
}
