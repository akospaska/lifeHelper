import * as React from 'react'

import { Divider, Flex, Box, Heading, Center, NativeBaseProvider } from 'native-base'

import { Text } from 'react-native'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { View } from 'react-native'

const WeightTrackeStatus = ({ data }) => {
  const { actual, change, trend, thisWeek, thisMonth, total } = data

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#373130',
        marginTop: wp('5%'),
        height: hp('20%'),
        width: wp('95%'),
      }}
    >
      <Box style={{ width: wp('80%'), marginLeft: 15, marginTop: 10 }}>
        <Flex mx="1" direction="row" justify="space-between" h="60">
          <View style={statusDetailStyle}>
            <Center>
              <Text style={textStyle}>Actual</Text>
              <Text style={textStyle}>{actual}</Text>
            </Center>
          </View>
          <Divider orientation="vertical" mx="1" />
          <View style={statusDetailStyle}>
            <Center>
              <Text style={textStyle}>Change</Text>
              <Text style={textStyle}>{change}</Text>
            </Center>
          </View>
          <Divider orientation="vertical" mx="1" />
          <View style={statusDetailStyle}>
            <Center>
              <Text style={textStyle}>Trend(This Week)</Text>
              <Text style={textStyle}>{trend}</Text>
            </Center>
          </View>
        </Flex>
        <Divider my="1" />

        <Flex mx="1" direction="row" justify="space-between" h="60">
          <View style={statusDetailStyle}>
            <Center>
              <Text style={textStyle}>This Week</Text>
              <Text style={textStyle}>{thisWeek}</Text>
            </Center>
          </View>
          <Divider orientation="vertical" mx="1" />
          <View style={statusDetailStyle}>
            <Center>
              <Text style={textStyle}>This Month</Text>
              <Text style={textStyle}>{thisMonth}</Text>
            </Center>
          </View>
          <Divider orientation="vertical" mx="1" />
          <View style={statusDetailStyle}>
            <Center>
              <Text style={textStyle}>Total</Text>
              <Text style={textStyle}>{total}</Text>
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
  backgroundColor: '#373530',
  textAlign: 'center',
}

const textStyle = {
  color: 'white',
}

/* textAlign: 'center', // <-- the magic
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 0,
    width: 200,
    backgroundColor: 'yellow', */
