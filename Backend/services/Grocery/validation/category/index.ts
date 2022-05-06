import Joi from 'joi'

export const getCategoriesWithItemsSchema = Joi.object().keys({
  accountId: Joi.required(),
  groupId: Joi.required(),
})

export const modifyCategoriesSchema = Joi.object().keys({
  accountId: Joi.required(),
  categoryId: Joi.required(),
  categoryDetails: {
    categoryName: Joi.required(),
    priority: Joi.number().required(),
    icon: Joi.string().required(),
  },
})

export const deleteCategoriesSchema = Joi.object().keys({
  accountId: Joi.required(),
  categoryId: Joi.required(),
})

export const getCategoriesSchema = Joi.object().keys({
  accountId: Joi.required(),
  groupId: Joi.required(),
})
