import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../utils/joi'

import { getGroceryCategoriesWithItems } from '../../../../databases/sql'
import { getCategoriesWithItemsSchema } from '../../../../validation/category'
import { handleError } from '../../../../utils/errorHandling'

export const getCategoriesWithItems = {
  method: 'POST',
  path: '/api/category/getcategorieswithitems',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    try {
      //1. input field validation
      const { accountId, groupId } = Joi.attempt(req.payload, getCategoriesWithItemsSchema, globalJoiOptions)

      const groups = await getGroceryCategoriesWithItems(groupId, accountId)

      const response = h.response(groups).code(200)

      return response
    } catch (error) {
      const errorResponseBody = handleError(error)
      const response = h.response(errorResponseBody).code(errorResponseBody.code)
      return response
    }
  },
}
