import React, { useEffect, useState } from 'react'

import { Box, Heading, Center, ScrollView, Flex } from 'native-base'

import ActionRows from './ActionRows/ActionRows'

import BabyTrackerHeader from './BabyTrackerHeader/BabyTrackerHeader'

const BabySleepTracker = () => {
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
        <BabyTrackerHeader />

        <ScrollView showsVerticalScrollIndicator={false}>
          <ActionRows />
        </ScrollView>
      </Box>
    </Center>
  )
}

export default () => {
  return <BabySleepTracker />
}
