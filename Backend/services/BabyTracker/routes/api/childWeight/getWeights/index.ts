import { ResponseToolkit, Request } from 'hapi'
import { getChildWeights } from '../../../../facade/childWeight'

import { getValidatedGetChildWeightsRequestBody } from '../../../../validation/childWeights'

export const getChildWeightsRoute = {
  method: 'post',
  path: '/api/children/getweights',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body

    const requestBody = req.payload as unknown as getChildWeightsType
    getValidatedGetChildWeightsRequestBody(requestBody)

    const response = h.response(await getChildWeights(requestBody)).code(200)

    return response
  },
}

export interface getChildWeightsType {
  accountId: number
  childId: number
  pagerStart: number
  pagerEnd: number
}
