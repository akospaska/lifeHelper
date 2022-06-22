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

const data = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    fullName: 'Aafreen Khan',
    timeStamp: '12:47 PM',
    recentText: 'Good Day!',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    actionId: 1,
    actionName: 'Sleep',
    duration: '27:11',
    startTime: '16:27',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    fullName: 'Sujitha Mathur',
    timeStamp: '11:11 PM',
    recentText: 'Cheer up, there!',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU',
    actionId: 2,
    actionName: 'BrestFeeding',
    duration: '27:11',
    startTime: '16:27',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    fullName: 'Anci Barroco',
    timeStamp: '6:22 PM',
    recentText: 'Good Day!',
    avatarUrl: 'https://miro.medium.com/max/1400/0*0fClPmIScV5pTLoE.jpg',
    actionId: 3,
    actionName: 'Walk',
    duration: '27:11',
    startTime: '16:27',
  },
  {
    id: '68694a0f-3da1-431f-bd56-142371e29d72',
    fullName: 'Aniket Kumar',
    timeStamp: '8:56 PM',
    recentText: 'All the best',
    avatarUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr01zI37DYuR8bMV5exWQBSw28C1v_71CAh8d7GP1mplcmTgQA6Q66Oo--QedAN1B4E1k&usqp=CAU',
    actionId: 4,
    actionName: 'Falling asleep',
    duration: '27:11',
    startTime: '16:27',
  },
  {
    id: '28694a0f-3da1-471f-bd96-142456e29d72',
    fullName: 'Kiara',
    timeStamp: '12:47 PM',
    recentText: 'I will call today.',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU',
    actionId: 1,
    actionName: 'Sleep',
    duration: '27:11',
    startTime: '16:27',
  },
]

const BabyTrackerStatistics = (props) => {
  const [service, setService] = useState(0)

  const { showCharts } = props

  console.log('I AM THE SHOWCHARTS')
  console.log(showCharts)

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
      <ScrollView>
        {!showCharts ? (
          <React.Fragment>
            <BabyTrackerFlatList data={data} />
            <BabyTrackerFlatList data={data} />
            <BabyTrackerFlatList data={data} />
            <BabyTrackerFlatList data={data} />
            <BabyTrackerFlatList data={data} />
            <BabyTrackerFlatList data={data} />
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
