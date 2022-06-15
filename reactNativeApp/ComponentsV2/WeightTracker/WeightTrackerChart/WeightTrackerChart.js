import * as React from 'react'
import { NativeBaseProvider, Box, HStack, VStack, Text, Pressable, Image, ScrollView, Button } from 'native-base'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { View } from 'react-native'

const WeightTrackerChart = ({ navigation }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Button onPress={() => console.log('hello world')} style={headerButtonStyle}>
        <Text>Weight</Text>
      </Button>
      <Button style={headerButtonStyle}>
        <Text>Goal</Text>
      </Button>
    </View>
  )
}
export default WeightTrackerChart

const headerButtonStyle = {
  marginTop: 20,
  width: wp('46%'),
  marginLeft: 10,
}
