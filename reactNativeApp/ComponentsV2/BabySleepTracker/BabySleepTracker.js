import React, { useEffect, useState } from 'react'

import {
  Box,
  Heading,
  Center,
  ScrollView,
  Flex,
  Select,
  CheckIcon,
  Menu,
  Pressable,
  HamburgerIcon,
  View,
} from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import ActionRows from './ActionRows/ActionRows'

import BabyTrackerHeader from './BabyTrackerHeader/BabyTrackerHeader'
import BabyTrackerStatistics from './BabyTrackerStatistics/BabyTrackerStatistics'
import ChildChooser from './ChildChooser/ChildChooser'
import BabyTrackerMenu from './BabyTrackerMenu/BabyTrackerMenu'
import ChildrenManager from './BabyTrackerMenu/ChildrenManager/ChildrenManager'

import DatePicker from 'react-native-modern-datepicker'
import RegisterChildModal from './BabyTrackerMenu/RegisterChildModal/RegisterChildModal'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { getApiGatewayInstance } from '../Api/getApiGatewayInstance/getApiGatewayInstance'

/*
 "eat": Object {
    "actionEnd": null,
    "actionId": 5,
    "actionStart": null,
    "id": null,
  },
  */
const fakeData = [
  {
    id: 1,
    actionId: 1,
    actionStart: 1656248418,
    actionEnd: null,
    actionName: 'Sleep',
    isRecording: true,
  },
  {
    id: 2,
    actionId: 2,
    actionStart: 1656247718,
    actionEnd: 1656247918,
    actionName: 'BrestFeed',
    isRecording: false,
  },
  {
    id: 3,
    actionId: 3,
    actionStart: 1656248018,
    actionEnd: 1656248318,
    actionName: 'Walk',
    isRecording: false,
  },
  {
    id: null,
    actionId: 4,
    actionStart: null,
    actionEnd: null,
    isRecording: false,
    actionName: 'Falling asleep',
  },
  {
    id: null,
    actionId: 5,
    actionStart: null,
    actionEnd: null,
    isRecording: false,
    actionName: 'Eat',
  },
]
const BabySleepTracker = () => {
  const [refreshPage, setRefreshPage] = useState(true)
  const [showStatistics, setShowStatistics] = useState(false)
  const [showCharts, setShowCharts] = useState(false)

  const [selectedKidId, setSelectedKidId] = useState(1)
  const [children, setChildren] = useState([])

  const [showRegisterChildModal, setShowRegisterChildModal] = useState(false)
  const [showChildrenManager, setShowChildrenManager] = useState(false)

  const [actionStatuses, setActionStatuses] = useState([])

  const refreshPageFn = () => {
    setRefreshPage(!refreshPage)
  }

  const getChildren = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    const response = await apiGateway.get('api/babytracker/children/getchildren')

    setSelectedKidId(response.data[0]?.id)
    setChildren(response.data)
  }

  const getLatestActions = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)
    try {
      const response = await apiGateway.post('api/babytracker/actions/getactionstatuses', { childId: selectedKidId })
      console.log(response.data)

      setActionStatuses(fakeData)
    } catch (error) {
      console.log(error.response)
      console.log(Object.keys(error))
    }
  }

  useEffect(() => {
    getLatestActions()
  }, [selectedKidId, refreshPage])

  useEffect(async () => {
    getChildren()
    console.log('setChildren triggered')
  }, [])
  return (
    <View height={hp('130%')} backgroundColor={'white'}>
      <Box flex="1" safeAreaTop padding={wp('2%')} w={wp('100%')}>
        <Heading p="4" pb="3" size="lg">
          Baby Tracker V 0.001
        </Heading>
        <Flex flexDirection={'row'}>
          <BabyTrackerMenu
            showChildrenManager={showChildrenManager}
            setShowChildrenManager={setShowChildrenManager}
            setShowRegisterChildModal={setShowRegisterChildModal}
          />
          <ChildChooser selectedKidId={selectedKidId} setSelectedKidId={setSelectedKidId} children={children} />
        </Flex>
        <Center>
          <BabyTrackerHeader
            setShowStatistics={setShowStatistics}
            showCharts={showCharts}
            setShowCharts={setShowCharts}
            showStatistics={showStatistics}
          />
        </Center>
        {showStatistics ? (
          <BabyTrackerStatistics showCharts={showCharts} />
        ) : (
          <ActionRows actionStatuses={actionStatuses} refreshPageFn={refreshPageFn} selectedKidId={selectedKidId} />
        )}
      </Box>
      <RegisterChildModal modalVisible={showRegisterChildModal} setModalVisible={setShowRegisterChildModal} />
      <ChildrenManager
        modalVisible={showChildrenManager}
        setModalVisible={setShowChildrenManager}
        children={children}
      />
    </View>
  )
}

export default () => {
  return <BabySleepTracker />
}
