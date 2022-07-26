import React from 'react'
import BabyTrackerStatisticsListItemSkeleton from '../BabyTrackerListItem/BabyTrackerStatisticsListItemSkeleton'

const BabyTrackerStatisticsListSkeleton = () => {
  return (
    <React.Fragment>
      <BabyTrackerStatisticsListItemSkeleton />
      <BabyTrackerStatisticsListItemSkeleton />
      <BabyTrackerStatisticsListItemSkeleton />
      <BabyTrackerStatisticsListItemSkeleton />
    </React.Fragment>
  )
}

export default BabyTrackerStatisticsListSkeleton
