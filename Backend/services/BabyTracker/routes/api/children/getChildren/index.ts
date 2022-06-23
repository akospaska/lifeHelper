import { ResponseToolkit, Request } from 'hapi'

import {
  getValidatedGetChildrenRequestBody,
  getChildrenRequestBodyType,
} from '../../../../validation/children/getChildren'
import { childTableType, getChildren, getParentPartnerAccountId } from '../../../../databases/sql'
import { setCorrectOrderByMergedChildrenArray } from '../../../../facade/children'

export const getChildrenRoute = {
  method: 'post',
  path: '/api/getchildren',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body

    const requestBody = req.payload as unknown as getChildrenRequestBodyType
    const { accountId } = getValidatedGetChildrenRequestBody(requestBody)

    //2. get children by createdBy
    const childenCreatedByAccountId: childTableType[] = await getChildren(accountId)

    //3. check is the accountID has partner in parentConnect

    const partnerAccountId: number = await getParentPartnerAccountId(accountId)

    if (partnerAccountId === 0) return childenCreatedByAccountId

    //4. if partnerAccountId not null get the parentPartnerChildren

    const childrenCreatedByPartner: childTableType[] = await getChildren(partnerAccountId)

    //5. Merge theese two array and sort by "isDefault"

    const sortedAndMergedChildArray = setCorrectOrderByMergedChildrenArray([
      ...childenCreatedByAccountId,
      ...childrenCreatedByPartner,
    ])

    //6. Return the found children
    const response = h.response(sortedAndMergedChildArray).code(200)

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
