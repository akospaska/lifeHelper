import * as React from 'react'

import { Divider, Flex, Box, Heading, Center, NativeBaseProvider } from 'native-base'

import { Text } from 'react-native'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { View } from 'react-native'

const WeightTrackeStatus = ({ data }) => {
  const { actual, change, trend, thisWeek, thisMonth, total } = data
  console.log(actual)
  return (
    <View
      style={{ flexDirection: 'row', backgroundColor: 'red', marginTop: wp('5%'), height: hp('20%'), width: wp('95%') }}
    >
      <Box style={{ width: wp('80%'), marginLeft: 15, marginTop: 10 }}>
        <Flex mx="1" direction="row" justify="space-between" h="60">
          <View style={statusDetailStyle}>
            <Center>
              <Text>Actual</Text>
              <Text>{actual}</Text>
            </Center>
          </View>
          <Divider orientation="vertical" mx="1" />
          <View style={statusDetailStyle}>
            <Center>
              <Text>Change</Text>
              <Text>{change}</Text>
            </Center>
          </View>
          <Divider orientation="vertical" mx="1" />
          <View style={statusDetailStyle}>
            <Center>
              <Text>Trend(This Week)</Text>
              <Text>{trend}</Text>
            </Center>
          </View>
        </Flex>
        <Divider my="1" />

        <Flex mx="1" direction="row" justify="space-between" h="60">
          <View style={statusDetailStyle}>
            <Center>
              <Text>This Week</Text>
              <Text>{thisWeek}</Text>
            </Center>
          </View>
          <Divider orientation="vertical" mx="1" />
          <View style={statusDetailStyle}>
            <Center>
              <Text>This Month</Text>
              <Text>{thisMonth}</Text>
            </Center>
          </View>
          <Divider orientation="vertical" mx="1" />
          <View style={statusDetailStyle}>
            <Center>
              <Text>Total</Text>
              <Text>{total}</Text>
            </Center>
          </View>
        </Flex>
      </Box>
    </View>
  )
}
export default WeightTrackeStatus

const statusDetailStyle = {
  width: 110,
  backgroundColor: 'yellow',
  textAlign: 'center',
}

/* textAlign: 'center', // <-- the magic
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 0,
    width: 200,
    backgroundColor: 'yellow', */
