import React, { useEffect, useState } from 'react'

import { Box, Heading, Center, ScrollView, Flex, Select, CheckIcon, Menu, Pressable, HamburgerIcon } from 'native-base'

import ActionRows from './ActionRows/ActionRows'

import BabyTrackerHeader from './BabyTrackerHeader/BabyTrackerHeader'
import BabyTrackerStatistics from './BabyTrackerStatistics/BabyTrackerStatistics'
import ChildChooser from './ChildChooser/ChildChooser'
import BabyTrackerMenu from './BabyTrackerMenu/BabyTrackerMenu'
import ChildrenManager from './BabyTrackerMenu/ChildrenManager/ChildrenManager'

import DatePicker from 'react-native-modern-datepicker'
import RegisterChildModal from './BabyTrackerMenu/RegisterChildModal/RegisterChildModal'

const getChildren = async () => {
  return [
    { id: 1, name: 'Márk' },
    { id: 2, name: 'Panna' },
    { id: 3, name: 'Piroska' },
  ]
}

const BabySleepTracker = () => {
  const [showStatistics, setShowStatistics] = useState(false)
  const [showCharts, setShowCharts] = useState(false)

  const [selectedKidId, setSelectedKidId] = useState(1)
  const [children, setChildren] = useState([])

  const [showRegisterChildModal, setShowRegisterChildModal] = useState(false)
  const [showChildrenManager, setShowChildrenManager] = useState(false)

  useEffect(async () => {
    const children = await getChildren()
    setChildren(children)
    console.log(children)
    console.log('Children has been set')
  }, [])
  return (
    <Center h="990px">
      <Box
        _dark={{
          bg: 'coolGray.800',
        }}
        _light={{
          bg: 'white',
        }}
        flex="1"
        safeAreaTop
        maxW="400px"
        w="100%"
      >
        <Heading p="4" pb="3" size="lg">
          Baby Tracker
        </Heading>
        <Flex flexDirection={'row'}>
          <BabyTrackerMenu
            showChildrenManager={showChildrenManager}
            setShowChildrenManager={setShowChildrenManager}
            setShowRegisterChildModal={setShowRegisterChildModal}
          />
          <ChildChooser selectedKidId={selectedKidId} setSelectedKidId={setSelectedKidId} />
        </Flex>
        <Center>
          <BabyTrackerHeader
            setShowStatistics={setShowStatistics}
            showCharts={showCharts}
            setShowCharts={setShowCharts}
            showStatistics={showStatistics}
          />
        </Center>
        {showStatistics ? <BabyTrackerStatistics showCharts={showCharts} /> : <ActionRows />}
      </Box>
      <RegisterChildModal modalVisible={showRegisterChildModal} setModalVisible={setShowRegisterChildModal} />
      <ChildrenManager modalVisible={showChildrenManager} setModalVisible={setShowChildrenManager} />
    </Center>
  )
}

export default () => {
  return <BabySleepTracker />
}
