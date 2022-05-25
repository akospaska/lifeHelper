import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../utils/joi'

import { createNewCategory, getCategoriesByGroupId, isTheAccountBelongsToTheGroup } from '../../../../databases/sql'
import { createCategorySchema } from '../../../../validation/category'
import { throwGlobalError } from '../../../../utils/errorHandling'

export const createCategoryRoute = {
  method: 'POST',
  path: '/api/category/createcategory',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. input field validation
    const { accountId, groupId, priority, icon, newCategoryName } = Joi.attempt(
      req.payload,
      createCategorySchema,
      globalJoiOptions
    )

    //1 check is the category belongs to the account id

    const gotPermission = await isTheAccountBelongsToTheGroup(accountId, groupId)

    if (!gotPermission) throwGlobalError('Permission Denied!', 403)

    //2 get categories

    await createNewCategory(newCategoryName, priority, groupId, accountId, icon)

    //3 send the categories
    const responseBody = { isValid: true }
    const response = h.response(responseBody).code(200)

    return response
  },
}
