import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../utils/joi'

import { createGroceryItemRequestBodySchema } from '../../../../validation/groceryItem'
import {
  insertNewGroceryItem,
  isTheAccounIdBelongsToTheCategory,
  isTheAccountBelongsToTheGroup,
} from '../../../../databases/sql'
import { throwGlobalError } from '../../../../utils/errorHandling'

export const createGroceryItemRoute = {
  method: 'POST',
  path: '/api/groceryitem/creategroceryitem',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. input field validation
    const { accountId, groupId, groceryItemName, categoryId } = Joi.attempt(
      req.payload,
      createGroceryItemRequestBodySchema,
      globalJoiOptions
    )

    //1. Check is the account belongs to the groupId

    const gotPermission = await isTheAccountBelongsToTheGroup(accountId, groupId)

    if (!gotPermission) throwGlobalError('Permission Denied', 403)

    //2. Check is the groupId belongs to the categoryId
    const gotPermission2 = await isTheAccounIdBelongsToTheCategory(accountId, categoryId)

    if (!gotPermission2) throwGlobalError('Permission Denied', 403)

    //3. insert the new record

    await insertNewGroceryItem(accountId, categoryId, groceryItemName)

    const responseBody = { isValid: true }
    //3. create the hapi response
    const response = h.response(responseBody).code(200)

    return response
  },
}
