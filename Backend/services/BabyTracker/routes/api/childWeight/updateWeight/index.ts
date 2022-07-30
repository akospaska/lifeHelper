import { ResponseToolkit, Request } from 'hapi'
import { updateChildWeight, updateChildWeightType } from '../../../../facade/childWeight'

import { getValidatedUpdateChildWeightRequestBody } from '../../../../validation/childWeights'

export const updateChildWeightRoute = {
  method: 'post',
  path: '/api/childrenweight/updateweight',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    const requestBody = req.payload as unknown as updateChildWeightType
    getValidatedUpdateChildWeightRequestBody(requestBody)
    await updateChildWeight(requestBody)
    return h.response({ isValid: true }).code(200)
  },
}
