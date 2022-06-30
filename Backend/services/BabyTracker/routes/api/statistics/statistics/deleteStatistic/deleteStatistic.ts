import { ResponseToolkit, Request } from 'hapi'

import {
  deleteStatisticRequestBodyType,
  getValidatedDeleteStatisticRequestBody,
} from '../../../../../validation/statistics/statistics'

export const deleteStatisticRoute = {
  method: 'post',
  path: '/api/statistics/statistics/deletestatistic',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body
    const requestBody = req.payload as unknown as deleteStatisticRequestBodyType

    const { accountId, statisticId } = getValidatedDeleteStatisticRequestBody(requestBody)

    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
