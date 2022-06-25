import { View } from 'react-native'
import { ScrollView } from 'native-base'

import { Ionicons } from '@expo/vector-icons'

import {
  Box,
  FlatList,
  Heading,
  Avatar,
  HStack,
  VStack,
  Text,
  Spacer,
  Center,
  NativeBaseProvider,
  Select,
  CheckIcon,
  Flex,
  Pressable,
} from 'native-base'

import { Icon } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import React, { useState } from 'react'
import BabyTrackerFlatList from './BabyTrackerFlatList/BabyTrackerFlatList'
import BabyTrackerStatisticsChart from './BabyTrackerStatisticsChart/BabyTrackerStatisticsChart'
import BabyTrackerListItem from './BabyTrackerListItem/BabyTrackerListItem'

const data = [
  [
    {
      id: 1,
      actionId: 1,
      actionName: 'Sleep',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
    {
      id: 2,
      actionId: 2,
      actionName: 'BrestFeeding',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
    {
      id: 3,
      actionId: 3,
      actionName: 'Walk',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
    {
      id: 4,
      actionId: 4,
      actionName: 'Falling asleep',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
    {
      id: 5,
      actionId: 1,
      actionName: 'Sleep',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
  ],
  [
    {
      id: 1,
      actionId: 1,
      actionName: 'Sleep',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
    {
      id: 2,
      actionId: 2,
      actionName: 'BrestFeeding',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
    {
      id: 3,
      actionId: 3,
      actionName: 'Walk',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
    {
      id: 4,
      actionId: 4,
      actionName: 'Falling asleep',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
    {
      id: 5,
      actionId: 1,
      actionName: 'Sleep',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
  ],
  [
    {
      id: 1,
      actionId: 1,
      actionName: 'Sleep',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
    {
      id: 2,
      actionId: 2,
      actionName: 'BrestFeeding',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
    {
      id: 3,
      actionId: 3,
      actionName: 'Walk',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
    {
      id: 4,
      actionId: 4,
      actionName: 'Falling asleep',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
    {
      id: 5,
      actionId: 1,
      actionName: 'Sleep',
      duration: '27:11',
      startTime: '16:27',
      endTime: '23:59',
      comment: 'I am the comment',
    },
  ],
  [
    {
      id: 1,
      actionId: 1,
      actionName: 'Sleep',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
    {
      id: 2,
      actionId: 2,
      actionName: 'BrestFeeding',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
    {
      id: 3,
      actionId: 3,
      actionName: 'Walk',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
    {
      id: 4,
      actionId: 4,
      actionName: 'Falling asleep',
      duration: '27:11',
      startTime: '16:27',
      endTime: '16:48',
      comment: 'I am the comment',
    },
    {
      id: 5,
      actionId: 1,
      actionName: 'Sleep',
      duration: '27:11',
      startTime: '16:27',
      endTime: '23:59',
      comment: 'I am the comment',
    },
  ],
]

const BabyTrackerStatistics = (props) => {
  const [service, setService] = useState(0)

  const { showCharts } = props

  return (
    <Center marginTop={10}>
      <Box w="3/4" maxW="300" marginTop={hp('1%')}>
        <Select
          selectedValue={service}
          minWidth="200"
          accessibilityLabel="Choose Service"
          placeholder="Choose Service"
          _selectedItem={{
            bg: 'teal.600',
            endIcon: <CheckIcon size="5" />,
          }}
          mt={1}
          onValueChange={(itemValue) => setService(itemValue)}
        >
          <Select.Item label="Latest actions" value={0} />
          <Select.Item label="Sleep" value={1} />
          <Select.Item label="BrestFeeding" value={2} />
          <Select.Item label="Walking Outside" value={3} />
          <Select.Item label="Falling asleep" value={4} />
        </Select>
        <Center>
          <Flex flexDirection={'row'} justifyContent={'space-between'} width={wp('75%')}>
            <Pressable onPress={() => console.log('Pressed')}>
              <Icon reverse name="arrow-back-outline" type="ionicon" color="#517fa4" size={10} />
            </Pressable>
            <Text>2022-06-16 || 2022-06-21</Text>
            <Pressable onPress={() => console.log('Pressed')}>
              <Icon reverse name="arrow-forward-outline" type="ionicon" color="#517fa4" size={10} />
            </Pressable>
          </Flex>
        </Center>
      </Box>
      <ScrollView height={hp('60%')}>
        {!showCharts ? (
          <React.Fragment>
            {data.map((a) => (
              <BabyTrackerListItem data={a} />
            ))}
          </React.Fragment>
        ) : (
          <View>
            <BabyTrackerStatisticsChart />
            <BabyTrackerStatisticsChart />
            <BabyTrackerStatisticsChart />
            <BabyTrackerStatisticsChart />
          </View>
        )}
      </ScrollView>
    </Center>
  )
}

export default BabyTrackerStatistics
