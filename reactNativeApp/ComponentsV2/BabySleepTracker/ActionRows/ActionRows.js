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

import { getApiGatewayInstance } from '../../Api/getApiGatewayInstance/getApiGatewayInstance'

import AsyncStorage from '@react-native-async-storage/async-storage'

const ActionRows = (props) => {
  const { actionStatuses, refreshPageFn, selectedKidId } = props

  const [actualTimer, setActualTimer] = useState('')

  const [isActiveTimerActionId1, setIsActiveTimerActionId1] = useState(false)
  const [isActiveTimerActionId2, setIsActiveTimerActionId2] = useState(false)
  const [isActiveTimerActionId3, setIsActiveTimerActionId3] = useState(false)
  const [isActiveTimerActionId4, setIsActiveTimerActionId4] = useState(false)
  const [isActiveTimerActionId5, setIsActiveTimerActionId5] = useState(false)

  const [allTimers, setAlltimers] = useState([])

  const [timerStartValue, setTimerStartValue] = useState(0)
  const [isActiveTimer, setIsActiveTimer] = useState(false)

  const [listData, setListData] = useState([])

  useEffect(() => {
    let interval = null
    const sum = [
      isActiveTimerActionId1,
      isActiveTimerActionId2,
      isActiveTimerActionId3,
      isActiveTimerActionId4,
      isActiveTimerActionId5,
    ]
    if (isActiveTimer || sum.includes(true)) {
      interval = setInterval(() => {
        const timerStand = calculateTimer(timerStartValue)

        actionStatuses.map((a) => {})

        setActualTimer(timerStand)
      }, 1000)
    } else if (!isActiveTimer) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [
    isActiveTimer,
    actualTimer,
    isActiveTimerActionId1,
    isActiveTimerActionId2,
    isActiveTimerActionId3,
    isActiveTimerActionId4,
    isActiveTimerActionId5,
  ])

  const calculateTimer = (startedTimeStamp) => {
    var actualTime = new Date().getTime()

    const dateInSeconds = new Date(actualTime + 3600000)

    const started = new Date(startedTimeStamp * 1000 + 3600000)

    const actualTimerStatus = dateInSeconds - started

    var timer = new Date(actualTimerStatus)

    const hours = timer.getHours()

    const minutes = timer.getMinutes() < 10 ? `0${timer.getMinutes()}` : timer.getMinutes()
    const seconds = timer.getSeconds() < 10 ? `0${timer.getSeconds()}` : timer.getSeconds()

    const result = `${hours === 0 ? `` : `${hours}:`}${minutes}:${seconds}`

    return result
  }

  const startAction = async (actionTypeId) => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)
    try {
      const response = await apiGateway.post('api/babytracker/actions/recordactions/automatically', {
        childId: selectedKidId,
        actionId: actionTypeId,
      })
      console.log(response.data)

      refreshPageFn()
    } catch (error) {
      console.log(error.response)
      console.log({
        childId: selectedKidId,
        actionId: actionTypeId,
      })
    }
  }

  const stopAction = async (actionId) => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)
    try {
      const response = await apiGateway.post('api/babytracker/actions/stopactions', {
        childId: selectedKidId,
        incrementedActionId: actionId,
      })
      console.log(response.data)

      refreshPageFn()
    } catch (error) {
      console.log(error.response)
    }
  }
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow()
    }
  }

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey)
    const newData = [...actionStatuses]
    const prevIndex = actionStatuses.findIndex((item) => item.key === rowKey)
    newData.splice(prevIndex, 1)
    setListData(newData)
  }

  const onRowDidOpen = (rowKey) => {
    console.log('This row opened', rowKey)
  }

  const renderItem = ({ item, index }) => {
    let timerActStand
    if (!item.actionEnd && item.actionStart) {
      console.log('I am rendering')

      const { actionId, actionStart } = item

      switch (actionId) {
        case 1:
          timerActStand = calculateTimer(actionStart)
          setIsActiveTimerActionId1(true)
          break
        case 2:
          timerActStand = calculateTimer(actionStart)
          setIsActiveTimerActionId2(true)

          break
        case 3:
          timerActStand = calculateTimer(actionStart)
          setIsActiveTimerActionId3(true)
          break
        case 4:
          timerActStand = calculateTimer(actionStart)
          setIsActiveTimerActionId4(true)
          break
        case 5:
          timerActStand = calculateTimer(actionStart)
          setIsActiveTimerActionId5(true)
          break
      }

      setTimerStartValue(item.actionStart)
      setIsActiveTimer(true)
    }

    return (
      <Box marginBottom={5} height={70}>
        <Pressable
          borderWidth="1"
          borderColor="coolGray.300"
          shadow="3"
          borderRadius={5}
          onPress={() => console.log('You touched me' + item.id)}
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
                {item.actionName}
              </Text>

              {!item.actionEnd && item.actionStart ? (
                <Text
                  fontSize="2xl"
                  color="coolGray.600"
                  _dark={{
                    color: 'warmGray.200',
                  }}
                >
                  {timerActStand}
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
                bg={!item.actionEnd && item.actionStart ? 'red.600' : 'green.500'}
                justifyContent="center"
                onPress={() => (item.isRecording ? stopAction(item.id) : startAction(item.actionId))}
                _pressed={{
                  opacity: 0.5,
                }}
              >
                <VStack alignItems="center" space={2}>
                  <Text fontSize="lg" fontWeight="medium" color="white">
                    {!item.actionEnd && item.actionStart ? 'Stop' : 'Start'}
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
        data={actionStatuses}
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
