import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../utils/joi'

import { deleteCategory, isTheAccounIdBelongsToTheCategory } from '../../../../databases/sql'
import { deleteCategoriesSchema } from '../../../../validation/category'
import { throwGlobalError } from '../../../../utils/errorHandling'

export const deleteCategoryRoute = {
  method: 'POST',
  path: '/api/category/deletecategory',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. input field validation
    const { accountId, categoryId } = Joi.attempt(req.payload, deleteCategoriesSchema, globalJoiOptions)

    //1 check is the category belongs to the account id

    const gotPermission = await isTheAccounIdBelongsToTheCategory(accountId, categoryId)

    if (!gotPermission) throwGlobalError('Permission Denied!', 403)

    //2 modify the category

    const updateResponse = await deleteCategory(categoryId)

    if (updateResponse !== 1) throwGlobalError('Database Error', 403)

    //3 return to the sender

    const responseBody = { isValid: true }

    const response = h.response(responseBody).code(200)

    return response
  },
}
