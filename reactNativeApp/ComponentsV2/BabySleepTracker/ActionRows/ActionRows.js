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
import { SwipeListView } from 'react-native-swipe-list-view'
import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons'

const ActionRows = () => {
  const [actualTimer, setActualTimer] = useState('')
  const [timerStartValue, setTimerStartValue] = useState(0)
  const [isActiveTimer, setIsActiveTimer] = useState(false)

  const [listData, setListData] = useState([])

  useEffect(() => {
    let interval = null
    if (isActiveTimer) {
      interval = setInterval(() => {
        const timerStand = calculateTimer(timerStartValue)

        setActualTimer(timerStand)
      }, 1000)
    } else if (!isActiveTimer) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActiveTimer, actualTimer])

  const calculateTimer = (startedTimeStamp) => {
    const actualTimeStamp = Date.now()

    const actualTimerStatus = actualTimeStamp - startedTimeStamp

    var timer = new Date(actualTimerStatus)

    const hours = timer.getHours() - 1

    const minutes = timer.getMinutes() < 10 ? `0${timer.getMinutes()}` : timer.getMinutes()
    const seconds = timer.getSeconds() < 10 ? `0${timer.getSeconds()}` : timer.getSeconds()

    const result = `${hours === 0 ? `` : `${hours}:`}${minutes}:${seconds}`

    return result
  }

  useEffect(() => {
    fetchActionsData()
  }, [])

  const fetchActionsData = async () => {
    const data = [
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        activityName: 'Sleep',
        timeStamp: '12:47 PM',
        isRecording: false,
        lastActionStartTime: null,
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        activityName: 'Eat',
        timeStamp: '11:11 PM',
        isRecording: false,
        lastActionStartTime: null,
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        activityName: 'Walk',
        timeStamp: '6:22 PM',
        isRecording: false,
        lastActionStartTime: null,
      },
      {
        id: '68694a0f-3da1-431f-bd56-142371e29d72',
        activityName: 'Falling asleep',
        timeStamp: '8:56 PM',
        isRecording: true,
        lastActionStartTime: 1655628648000,
      },
    ]

    setListData(data)
  }

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow()
    }
  }

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey)
    const newData = [...listData]
    const prevIndex = listData.findIndex((item) => item.key === rowKey)
    newData.splice(prevIndex, 1)
    setListData(newData)
  }

  const onRowDidOpen = (rowKey) => {
    console.log('This row opened', rowKey)
  }

  const renderItem = ({ item, index }) => {
    if (item.isRecording) {
      setTimerStartValue(item.lastActionStartTime)
      setIsActiveTimer(true)
    }

    return (
      <Box marginBottom={5} height={70}>
        <Pressable
          borderWidth="1"
          borderColor="coolGray.300"
          shadow="3"
          borderRadius={5}
          onPress={() => console.log('You touched me')}
          _dark={{
            bg: 'coolGray.800',
          }}
          _light={{
            bg: 'white',
          }}
        >
          <Box pl="4" pr="5" py="2">
            <Flex direction="row" justifyContent={'space-between'}>
              <Text
                width={150}
                color="coolGray.800"
                _dark={{
                  color: 'warmGray.50',
                }}
                bold
              >
                {item.activityName}
              </Text>

              {item.isRecording ? (
                <Text
                  fontSize="2xl"
                  color="coolGray.600"
                  _dark={{
                    color: 'warmGray.200',
                  }}
                >
                  {actualTimer}
                </Text>
              ) : null}

              <Pressable
                height={50}
                borderWidth="1"
                borderColor="coolGray.300"
                shadow="3"
                borderRadius={5}
                w="100"
                ml="auto"
                bg={item.isRecording ? 'red.600' : 'green.500'}
                justifyContent="center"
                onPress={() => /* closeRow(rowMap, data.item.key) */ console.log('Pressed')}
                _pressed={{
                  opacity: 0.5,
                }}
              >
                <VStack alignItems="center" space={2}>
                  <Text fontSize="lg" fontWeight="medium" color="white">
                    {item.isRecording ? 'Stop' : 'Start'}
                  </Text>
                </VStack>
              </Pressable>
            </Flex>
          </Box>
        </Pressable>
      </Box>
    )
  }

  const renderHiddenItem = (data, rowMap) => (
    <HStack flex="1" pl="2">
      <Pressable
        height={50}
        borderWidth="1"
        borderColor="coolGray.300"
        shadow="3"
        borderRadius={5}
        w="100"
        ml="auto"
        bg="coolGray.200"
        justifyContent="center"
        onPress={() => closeRow(rowMap, data.item.key)}
        _pressed={{
          opacity: 0.5,
        }}
      >
        <VStack alignItems="center" space={2}>
          <Icon as={<Entypo name="dots-three-horizontal" />} size="xs" color="coolGray.800" />
          <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
            Manual Store
          </Text>
        </VStack>
      </Pressable>
    </HStack>
  )

  return (
    <Box bg="white" safeArea flex="1">
      <SwipeListView
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-130}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
      />
    </Box>
  )
}

export default ActionRows
