import { ResponseToolkit, Request } from 'hapi'
import {
  deleteStatistic,
  isTheRequesterAccountBelongsToTheStatistic,
} from '../../../../../dataAccessLayer/statistics/statistics'
import { throwGlobalError } from '../../../../../utils/errorHandling'

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

    //Check is the statistic belongs to the requester accountId
    const isTheStatisticBelongsToTheRequester = await isTheRequesterAccountBelongsToTheStatistic(statisticId, accountId)

    if (!isTheStatisticBelongsToTheRequester) throwGlobalError('Access Denied!', 403)

    //Soft delete the statistic
    const deleteResult = await deleteStatistic(statisticId)

    if (deleteResult > 1) throwGlobalError('Oppsy, Call the Sys Admin Now!!44!', 500)
    if (deleteResult != 1) throwGlobalError('Oppsy, something gone wrong!', 400)

    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
