import React, { useEffect, useState } from 'react'

import { Box, Heading, Center, ScrollView, Flex } from 'native-base'

import ActionRows from './ActionRows/ActionRows'

import BabyTrackerHeader from './BabyTrackerHeader/BabyTrackerHeader'
import BabyTrackerStatistics from './BabyTrackerStatistics/BabyTrackerStatistics'

const BabySleepTracker = () => {
  const [showStatistics, setShowStatistics] = useState(false)
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
        <BabyTrackerHeader setShowStatistics={setShowStatistics} />

        {showStatistics ? <BabyTrackerStatistics /> : <ActionRows />}
      </Box>
    </Center>
  )
}

export default () => {
  return <BabySleepTracker />
}
