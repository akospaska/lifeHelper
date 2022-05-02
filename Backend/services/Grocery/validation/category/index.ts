import Joi from 'joi'

export const getCategoriesWithItemsSchema = Joi.object().keys({
  accountId: Joi.required(),
  groupId: Joi.required(),
})
