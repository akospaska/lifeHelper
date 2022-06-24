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
import { View, StyleSheet } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const BabyTrackHeaderButton = () => {
  ;<Pressable
    height={50}
    borderWidth="1"
    borderColor="coolGray.300"
    shadow="3"
    borderRadius={5}
    w="100"
    ml="auto"
    bg={'coolGray.400'}
    justifyContent="center"
    onPress={() => setShowStatistics(false)}
    _pressed={{
      opacity: 0.5,
    }}
  >
    <VStack alignItems="center" space={2}>
      <Text fontSize="lg" fontWeight="medium" color="white">
        'Actions'
      </Text>
    </VStack>
  </Pressable>
}

export default BabyTrackHeaderButton
