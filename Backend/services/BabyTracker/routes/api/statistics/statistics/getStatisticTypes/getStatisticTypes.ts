import { ResponseToolkit, Request } from 'hapi'
import { getStatisticTypes } from '../../../../../dataAccessLayer/statistics/statistics'

import {
  getStatisticsRequestBodyType,
  getValidatedStatisticTypesRequestBody,
} from '../../../../../validation/statistics/statistics'

export const getStatisticTypesRoute = {
  method: 'post',
  path: '/api/statistics/statistics/getstatistictypes',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body
    const requestBody = req.payload as unknown as getStatisticsRequestBodyType

    //Check is the authorization was success
    getValidatedStatisticTypesRequestBody(requestBody)

    const statisitcTypes = await getStatisticTypes()

    const response = h.response(statisitcTypes).code(200)

    return response
  },
}
