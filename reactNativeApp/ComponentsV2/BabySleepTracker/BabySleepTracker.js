import React, { useEffect, useState } from 'react'

import {
  Box,
  Heading,
  Center,
  ScrollView,
  Flex,
  Text,
  View,
  useColorMode,
  useColorModeValue,
  Button,
  extendTheme,
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

const BabySleepTracker = () => {
  const [refreshPage, setRefreshPage] = useState(true)
  const [showStatistics, setShowStatistics] = useState(false)
  const [showCharts, setShowCharts] = useState(false)

  const [selectedKidId, setSelectedKidId] = useState(0)
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

    try {
      const response = await apiGateway.get('api/babytracker/children/getchildren')

      setSelectedKidId(response.data[0]?.id)
      setChildren(response.data)
    } catch (error) {
      console.log(error.response)
    }
  }

  const getLatestActions = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)
    try {
      const response = await apiGateway.post('api/babytracker/actions/getactionstatuses', { childId: selectedKidId })
      console.log(response.data)

      setActionStatuses(response.data)
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
    <View height={hp('130%')} marginLeft={wp('-5%')} width={wp('110%')} bg={'white'}>
      <Box flex="1" safeAreaTop padding={wp('2%')}>
        <Heading p="4" pb="3" size="lg">
          Baby Tracker v 0.008
        </Heading>
        <Flex flexDirection={'row'} justifyContent={'space-between'}>
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
