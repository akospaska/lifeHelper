import { ResponseToolkit, Request } from 'hapi'
import { getChildWeights, insertChildWeight, insertChildWeightType } from '../../../../facade/childWeight'

import { getValidatedGetChildWeightsRequestBody, getValidatedInsertChildWeightRequestBody } from '../../../../validation/childWeights'

export const insertChildWeightRoute = {
  method: 'post',
  path: '/api/children/insertnewweight',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    const requestBody = req.payload as unknown as insertChildWeightType
    getValidatedInsertChildWeightRequestBody(requestBody)

    const response = h.response(await insertChildWeight(requestBody)).code(200)

    return response
  },
}
