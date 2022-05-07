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
  accountId: Joi.number().required(),
  categoryId: Joi.number().required(),
})

export const getCategoriesSchema = Joi.object().keys({
  accountId: Joi.number().required(),
  groupId: Joi.number().required(),
})

export const createCategorySchema = Joi.object().keys({
  newCategoryName: Joi.string().required(),
  accountId: Joi.number().required(),
  groupId: Joi.number().required(),
  icon: Joi.string().required(),
  priority: Joi.number().required(),
})
