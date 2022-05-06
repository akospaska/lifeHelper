import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../utils/joi'

import { getCategoriesByGroupId, isTheAccountBelongsToTheGroup } from '../../../../databases/sql'
import { getCategoriesSchema } from '../../../../validation/category'
import { throwGlobalError } from '../../../../utils/errorHandling'

export const getCategoriesRoute = {
  method: 'POST',
  path: '/api/category/getcategories',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. input field validation
    const { accountId, groupId } = Joi.attempt(req.payload, getCategoriesSchema, globalJoiOptions)

    //1 check is the category belongs to the account id

    const gotPermission = await isTheAccountBelongsToTheGroup(accountId, groupId)

    if (!gotPermission) throwGlobalError('Permission Denied!', 403)

    //2 get categories

    const categories = await getCategoriesByGroupId(groupId)

    //3 send the categories

    const response = h.response(categories).code(200)

    return response
  },
}
