import React from 'react'
import {
  Button,
  Actionsheet,
  useDisclose,
  Box,
  Text,
  Center,
  NativeBaseProvider,
  VStack,
  IconButton,
} from 'native-base'

import { MaterialIcons } from '@expo/vector-icons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { View } from 'native-base'

function WeightTrackerMenuButton(props) {
  const { setShowModal } = props
  return (
    <View style={{ marginBottom: hp('15%'), width: wp('20%'), marginLeft: wp('75%') }}>
      <Center>
        <VStack space={4} alignItems="center">
          <IconButton
            size="lg"
            variant="solid"
            _icon={{
              as: MaterialIcons,
              name: 'add',
            }}
            onPress={() => setShowModal(true)}
          />
        </VStack>
      </Center>
    </View>
  )
}

export default WeightTrackerMenuButton
