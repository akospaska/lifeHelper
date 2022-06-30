import { ResponseToolkit, Request } from 'hapi'

import { getValidatedUpdateChildRequestBody } from '../../../../validation/children/getChildren'

import { getChild, isTheChildBelongsToTheAccountId, updateChild } from '../../../../dataAccessLayer/children'

import { setCorrectOrderByMergedChildrenArray } from '../../../../facade/children'
import { throwGlobalError } from '../../../../utils/errorHandling'

export const updateChildRoute = {
  method: 'post',
  path: '/api/children/updatechild',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body

    const requestBody = req.payload as unknown as any
    const { accountId, childId, name, isDefault } = getValidatedUpdateChildRequestBody(requestBody)

    //2. Check is the child belongs to the accountId
    const isTheChildBelongsToTheAccount = await isTheChildBelongsToTheAccountId(childId, accountId)

    if (!isTheChildBelongsToTheAccount) throwGlobalError('Access Denied!', 403)

    const updateResult = await updateChild(childId, name, isDefault)

    if (updateResult > 1) throwGlobalError('Oppsy, Call the Sys Admin Now!!44!', 500)
    if (updateResult != 1) throwGlobalError('Oppsy, something gone wrong!', 400)

    //6. Return the found children
    const response = h.response({ isValid: true }).code(200)

    return response
  },
}

export interface registerAccountRequestBody {
  emailAddress: string
  password: string
  passwordAgain: string
  creatorAccountId: number
  isAdmin: boolean
}
