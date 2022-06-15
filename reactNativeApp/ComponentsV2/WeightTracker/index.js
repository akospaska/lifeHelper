import * as React from 'react'

import { Box, ScrollView } from 'native-base'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { View } from 'react-native'

import WeightTrackerHeader from './WeightTrackerHeader'
import WeightTrackerStatus from './WeightTrackerStatus/WeightTrackerStatus'
import WeightTrackerChart from './WeightTrackerChart/WeightTrackerChart'
import WeightTrackerMenuButton from './WeightTrackerMenuButton'

const testData = { actual: 74.9, change: 0, trend: -0.2, thisWeek: -1.2, thisMonth: 0.9, total: -0.8 }

const WeightTracker = ({ navigation }) => {
  return (
    <View style={{ margin: 0, marginTop: wp('5%'), backgroundColor: '#292524', height: hp('115%') }}>
      <ScrollView style={{ margin: 0, marginTop: wp('5%'), backgroundColor: '#292524', height: wp('150%') }}>
        <Box alignItems="center" style={{ marginTop: wp('10%') }}>
          <WeightTrackerHeader />
          <WeightTrackerStatus data={testData} />
          <WeightTrackerChart />
        </Box>
      </ScrollView>
      <WeightTrackerMenuButton />
    </View>
  )
}
export default WeightTracker
