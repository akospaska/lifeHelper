import Joi from 'joi'

const webProcessServerVariablesSchema = Joi.object().keys({
  port: Joi.required(),
  host: Joi.required(),
})

export const validatedWebProcessServerVariables: webProcessServerVariables = Joi.attempt(
  {
    port: process.env.API_GATEWAY_PORT,
    host: process.env.API_GATEWAY_HOST,
  },
  webProcessServerVariablesSchema
)

interface webProcessServerVariables {
  port: string
  host: string
}
