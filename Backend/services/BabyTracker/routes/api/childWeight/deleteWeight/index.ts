import { ResponseToolkit, Request } from 'hapi'
import { deleteChildWeight, deleteChildWeightType } from '../../../../facade/childWeight'

import { getValidatedDeleteChildWeightRequestBody } from '../../../../validation/childWeights'

export const deleteChildWeightsRoute = {
  method: 'post',
  path: '/api/children/deleteweight',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    const requestBody = req.payload as unknown as deleteChildWeightType
    getValidatedDeleteChildWeightRequestBody(requestBody)
    await deleteChildWeight(requestBody)

    return h.response({ isValid: true }).code(200)
  },
}
