import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../utils/joi'

import { deleteGroceryItemRequestBodySchema } from '../../../../validation/groceryItem'
import {
  deleteGroceryItem,
  getGroceryItemDetails,
  isTheAccounIdBelongsToTheCategory,
  isTheAccountBelongsToTheGroup,
} from '../../../../databases/sql'
import { throwGlobalError } from '../../../../utils/errorHandling'

export const deleteGroceryItemRoute = {
  method: 'POST',
  path: '/api/groceryitem/deletegroceryitem',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. input field validation
    const { accountId, groceryItemId } = Joi.attempt(req.payload, deleteGroceryItemRequestBodySchema, globalJoiOptions)

    //2. get the categoryId of the item details
    const groceryItemDetails = await getGroceryItemDetails(groceryItemId)
    console.log(groceryItemDetails)

    if (!groceryItemDetails) throwGlobalError('Invalid parameters', 403)

    //3. Check is the account belongs to the groupId
    const gotPermission1 = await isTheAccountBelongsToTheGroup(accountId, groceryItemDetails.groupId)
    if (!gotPermission1) throwGlobalError('Permission Denied', 403)

    //4. get the groupId where the category belongs
    const gotPermission2 = await isTheAccounIdBelongsToTheCategory(accountId, groceryItemDetails.categoryId)

    if (!gotPermission2) throwGlobalError('Permission Denied', 403)

    //5. softDelete the grocery item
    await deleteGroceryItem(groceryItemId)

    //3. insert the new record

    const responseBody = { isValid: true }
    //3. create the hapi response
    const response = h.response(responseBody).code(200)

    return response
  },
}
