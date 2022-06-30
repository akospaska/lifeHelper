import { ResponseToolkit, Request } from 'hapi'
import {
  getStatisticById,
  isTheRequesterAccountBelongsToTheStatistic,
  updateStatistic,
} from '../../../../../dataAccessLayer/statistics/statistics'
import { throwGlobalError } from '../../../../../utils/errorHandling'

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

    //Check is the statistic belongs to the requester accountId
    const isBelongsToTheAccountId = await isTheRequesterAccountBelongsToTheStatistic(statisticId, accountId)
    if (!isBelongsToTheAccountId) throwGlobalError('Access Denied!', 403)

    //Do the update itself!
    const updateResult = await updateStatistic(statisticId, startTime, endTime, comment)

    if (updateResult > 1) throwGlobalError('Oppsy, Call the Sys Admin Now!!44!', 500)

    if (updateResult != 1) throwGlobalError('Oppsy, something gone wrong!', 400)

    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
