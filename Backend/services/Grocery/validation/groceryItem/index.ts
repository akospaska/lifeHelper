import Joi from 'joi'

export const createGroceryItemRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().required(),
  groupId: Joi.number().required(),
  groceryItemName: Joi.string().required(),
  categoryId: Joi.number().required(),
})

export const deleteGroceryItemRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().required(),
  groceryItemId: Joi.number().required(),
})
