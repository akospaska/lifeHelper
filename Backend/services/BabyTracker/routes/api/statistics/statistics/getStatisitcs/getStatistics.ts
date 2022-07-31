import { ResponseToolkit, Request } from 'hapi'
import { isTheChildBelongsToTheAccountId } from '../../../../../dataAccessLayer/children'
import { getLatestActions, getLatestActionsByActionId } from '../../../../../dataAccessLayer/statistics/statistics'
import { formatStatistics } from '../../../../../facade/statistics/statistics'
import { throwGlobalError } from '../../../../../utils/errorHandling'

import { getStatisticsRequestBodyType, getValidatedGetStatisticsRequestBody } from '../../../../../validation/statistics/statistics'

export const getStatisticsRoute = {
  method: 'post',
  path: '/api/statistics/statistics/getstatistics',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body
    const requestBody = req.payload as unknown as getStatisticsRequestBodyType

    const { accountId, statisticsTypeId, childId, intervallStart, intervallEnd } = getValidatedGetStatisticsRequestBody(requestBody)

    const theChildBelongsToTheAccountId = await isTheChildBelongsToTheAccountId(childId, accountId)

    if (!theChildBelongsToTheAccountId) throwGlobalError('Access Denied!', 403)

    let actions

    switch (statisticsTypeId) {
      case 1: //latestActions
        actions = await getLatestActions(childId, intervallStart, intervallEnd)
        break

      case 3: //latest sleeps
        actions = await getLatestActionsByActionId(childId, intervallStart, intervallEnd, 1)
        break

      case 4: //breastFeeding
        actions = await getLatestActionsByActionId(childId, intervallStart, intervallEnd, 2)
        break

      case 5: //latest walks
        actions = await getLatestActionsByActionId(childId, intervallStart, intervallEnd, 3)
        break
      case 6: //latest falling asleeps
        actions = await getLatestActionsByActionId(childId, intervallStart, intervallEnd, 4)
        break

      default:
        throwGlobalError('Invalid Statistic ID!', 405)
        break
    }

    //const formatTheActionResult,
    const formattedStatistics = formatStatistics(actions)

    const response = h.response(formattedStatistics).code(200)

    return response
  },
}
