import { ResponseToolkit, Request } from 'hapi'

import {
  getValidatedUpdateStatisticRequestBody,
  updateStatisticTypeRequestBodyType,
} from '../../../../../validation/statistics/statistics'

export const updateStatisticRoute = {
  method: 'post',
  path: '/api/statistics/statistics/updatestatistic',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body
    const requestBody = req.payload as unknown as updateStatisticTypeRequestBodyType

    const { accountId, startTime, endTime, comment, statisticId } = getValidatedUpdateStatisticRequestBody(requestBody)

    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
