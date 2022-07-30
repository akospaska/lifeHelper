import { ResponseToolkit, Request } from 'hapi'
import { insertChildWeight, insertChildWeightType } from '../../../../facade/childWeight'

import { getValidatedInsertChildWeightRequestBody } from '../../../../validation/childWeights'

export const insertChildWeightRoute = {
  method: 'post',
  path: '/api/childrenweight/insertnewweight',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    const requestBody = req.payload as unknown as insertChildWeightType
    getValidatedInsertChildWeightRequestBody(requestBody)

    return h.response(await insertChildWeight(requestBody)).code(200)
  },
}
