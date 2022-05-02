import Joi from 'joi'

export const getGroupsRequestBodySchema = Joi.object().keys({
  accountId: Joi.required(),
})
