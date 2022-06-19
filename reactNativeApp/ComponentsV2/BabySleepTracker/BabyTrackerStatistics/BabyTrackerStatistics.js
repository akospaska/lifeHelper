import { View } from 'react-native'
import { ScrollView } from 'native-base'

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
} from 'native-base'

import { Icon } from 'react-native-elements'

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

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useState } from 'react'
import BabyTrackerFlatList from './BabyTrackerFlatList/BabyTrackerFlatList'

const BabyTrackerStatistics = () => {
  const [service, setService] = useState(0)

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
      </Box>
      <ScrollView>
        <BabyTrackerFlatList data={data} />
        <BabyTrackerFlatList data={data} />
        <BabyTrackerFlatList data={data} />
        <BabyTrackerFlatList data={data} />
        <BabyTrackerFlatList data={data} />
        <BabyTrackerFlatList data={data} />
      </ScrollView>
    </Center>
  )
}

export default BabyTrackerStatistics
