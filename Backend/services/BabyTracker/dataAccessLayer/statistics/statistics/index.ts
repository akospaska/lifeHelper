import { knex } from '../../../databases/sql'

const actionTableName = 'action'

export const getLatestActions = async (childId: number, pagerStart: number, pagerEnd: number) => {
  const dat1 = new Date(new Date().setDate(new Date().getDate() - pagerStart))
  const dat2 = new Date(new Date().setDate(new Date().getDate() - pagerEnd))

  const latestActions: actionTableType[] = await knex(actionTableName)
    .select('id', 'actionId', 'actionStart', 'actionEnd', 'childId', 'comment', 'creationDate')
    .orderBy('creationDate', 'desc')
    .where({ childId: childId, isDeleted: null })
    .where('actionStart', '>', 0)
    .where('actionEnd', '>', 0)
    .where('creationDate', '>=', dat2)
    .where('creationDate', '<', dat1)

  return latestActions
}

export interface actionTableType {
  id: number
  actionId: number
  actionStart: number
  actionEnd: number
  childId: number
  createdBy: number
  comment: string
  creationDate: Date
}
