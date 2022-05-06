import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../utils/joi'

import {
  getGroceryCategories,
  getGroups,
  isTheAccounIdBelongsToTheCategory,
  updateCategory,
} from '../../../../databases/sql'
import { getCategoriesWithItemsSchema, modifyCategoriesSchema } from '../../../../validation/category'
import { handleError, throwGlobalError } from '../../../../utils/errorHandling'

export const modifyCategoryRoute = {
  method: 'POST',
  path: '/api/category/modifycategory',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. input field validation
    const { accountId, categoryId, categoryDetails } = Joi.attempt(
      req.payload,
      modifyCategoriesSchema,
      globalJoiOptions
    )

    //1 check is the category belongs to the account id

    const gotPermission = await isTheAccounIdBelongsToTheCategory(accountId, categoryId)

    if (!gotPermission) throwGlobalError('Permission Denied!', 403)

    //2 modify the category

    const { categoryName, priority, icon } = categoryDetails

    const updateResponse = await updateCategory(categoryId, categoryName, priority, icon)

    if (updateResponse !== 1) throwGlobalError('Database Error', 403)

    //3 return to the sender

    const responseBody = { isValid: true }

    const response = h.response(responseBody).code(200)

    return response
  },
}
