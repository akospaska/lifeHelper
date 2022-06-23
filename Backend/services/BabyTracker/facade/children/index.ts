import { childTableType } from '../../databases/sql'

export const setCorrectOrderByMergedChildrenArray = (mergedChildrenArray: childTableType[]) =>
  mergedChildrenArray.sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
