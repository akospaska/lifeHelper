import * as React from 'react'

import { Box, ScrollView } from 'native-base'

import { useState } from 'react'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { View } from 'react-native'

import WeightTrackerHeader from './WeightTrackerHeader'
import WeightTrackerStatus from './WeightTrackerStatus/WeightTrackerStatus'
import WeightTrackerChart from './WeightTrackerChart/WeightTrackerChart'
import WeightTrackerMenuButton from './WeightTrackerMenuButton'
import InsertNewRecordModal from './insertNewRecordModal/insertNewRecordModal'

const fakeApiData = {
  weights: [
    { day: '07', weight: 71, id: 1 },
    { day: '08', weight: 73, id: 2 },
    { day: '09', weight: 73, id: 2 },
    { day: '10', weight: 75, id: 3 },
    { day: '11', weight: 74, id: 4 },
    { day: '12', weight: 73, id: 5 },
    { day: '13', weight: 74, id: 6 },
    { day: '14', weight: 75, id: 7 },
    { day: '15', weight: 76, id: 8 },
    { day: '16', weight: 77, id: 9 },
  ],
  status: { actual: 74.9, change: 0, trend: -0.2, thisWeek: -1.2, thisMonth: 0.9, total: -0.8 },
}

const WeightTracker = () => {
  const [createNewModalIsOpen, setCreateNewModalIsOpen] = useState(false)

  return (
    <View style={{ margin: 0, marginTop: wp('5%'), backgroundColor: '#292524', height: hp('115%') }}>
      <Box alignItems="center" style={{ marginTop: wp('10%') }}>
        <WeightTrackerHeader />
        <WeightTrackerStatus data={fakeApiData.status} />
        <WeightTrackerChart chartData={fakeApiData.weights} />
      </Box>
      <WeightTrackerMenuButton setShowModal={setCreateNewModalIsOpen} />
      <InsertNewRecordModal showModal={createNewModalIsOpen} setShowModal={setCreateNewModalIsOpen} />
    </View>
  )
}
export default WeightTracker
