import { ResponseToolkit, Request } from 'hapi'
import { getChildWeights } from '../../../../facade/childWeight'

import { getValidatedGetChildWeightsRequestBody } from '../../../../validation/childWeights'

export const getChildWeightsRoute = {
  method: 'post',
  path: '/api/childrenweight/getweights',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    const requestBody = req.payload as unknown as getChildWeightsType
    getValidatedGetChildWeightsRequestBody(requestBody)

    return h.response(await getChildWeights(requestBody)).code(200)
  },
}

export interface getChildWeightsType {
  accountId: number
  childId: number
  pagerStart: number
  pagerEnd: number
}
