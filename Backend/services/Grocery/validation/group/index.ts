import Joi from 'joi'

export const getGroupsRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().required(),
})

export const createGroupRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().required(),
  newGroupName: Joi.string().required(),
})

export const deleteGroupRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().required(),
  groupId: Joi.number().required(),
})
