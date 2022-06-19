import React, { useEffect, useState } from 'react'

import {
  NativeBaseProvider,
  Box,
  Text,
  Pressable,
  Heading,
  Icon,
  HStack,
  Avatar,
  VStack,
  Spacer,
  Center,
  ScrollView,
  Flex,
} from 'native-base'
import { View, StyleSheet } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const BabyTrackerHeader = (props) => {
  const { setShowStatistics } = props
  return (
    <View style={styles.container}>
      <Pressable
        height={50}
        borderWidth="1"
        borderColor="coolGray.300"
        shadow="3"
        borderRadius={5}
        w="100"
        ml="auto"
        bg={'coolGray.400'}
        justifyContent="center"
        onPress={() => setShowStatistics(false)}
        _pressed={{
          opacity: 0.5,
        }}
      >
        <VStack alignItems="center" space={2}>
          <Text fontSize="lg" fontWeight="medium" color="white">
            'Actions'
          </Text>
        </VStack>
      </Pressable>
      <Pressable
        height={50}
        borderWidth="1"
        borderColor="coolGray.300"
        shadow="3"
        borderRadius={5}
        w="100"
        ml="auto"
        bg={'coolGray.400'}
        justifyContent="center"
        onPress={() => setShowStatistics(true)}
        _pressed={{
          opacity: 0.5,
        }}
      >
        <VStack alignItems="center" space={2}>
          <Text fontSize="lg" fontWeight="medium" color="white">
            'Statistics'
          </Text>
        </VStack>
      </Pressable>
    </View>
  )
}

export default BabyTrackerHeader

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'aliceblue',
    width: wp('50%'),
    // height: hp('15%'),
    height: hp('8%'),
    marginBottom: -10,
  },
  box: {
    width: 50,
    height: 50,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'oldlace',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: 'coral',
    borderWidth: 0,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'coral',
  },
  selectedLabel: {
    color: 'white',
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 24,
  },
})
