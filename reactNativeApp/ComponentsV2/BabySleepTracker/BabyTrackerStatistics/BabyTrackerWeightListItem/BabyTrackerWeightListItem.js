import { Flex, Text, Pressable, Box, Fab, Icon } from 'native-base'
import { Ionicons } from '@expo/vector-icons'

import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { getDatePickerInitialDateFormat } from '../../../Utils/timeFormatter'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import BabyTrackerWeightListItemUpdateModal from './BabyTrackerWeightListItemUpdateModal/BabyTrackerWeightListItemUpdateModal'

import { Shadow } from 'react-native-shadow-2'

const BabyTrackerWeightListItem = (props) => {
  const { data, refreshStatistics, childId } = props
  const [modalVisible, setModalVisible] = useState(false)
  return (
    <View>
      <Pressable
        _pressed={{
          backgroundColor: 'gray.100',
        }}
        borderLeftRadius={12}
        borderRightRadius={12}
        borderWidth="1"
        paddingTop={hp('0.5%')}
        borderColor={'gray.200'}
        width={wp('80%')}
        marginBottom={hp('0.5%')}
        onPress={() => {
          setModalVisible(true)
          console.log(modalVisible)
        }}
      >
        <Flex flexDirection={'row'} justifyContent="space-around">
          <Flex flexDirection={'row'}>
            <Ionicons name="md-calendar-outline" size={35} color="#059669" />
            <Text style={{ fontSize: 20, paddingTop: 15, paddingLeft: 5 }}>{getDatePickerInitialDateFormat(data.date)}</Text>
          </Flex>

          <Flex flexDirection={'row'}>
            <MaterialCommunityIcons name="weight" size={40} color="#0891b2" />

            <Text style={{ fontSize: 20, paddingTop: 15, marginLeft: 10 }}>{data.weight} g</Text>
          </Flex>
        </Flex>
        <Text>{data.comment}</Text>
      </Pressable>

      <BabyTrackerWeightListItemUpdateModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        data={data}
        refreshStatistics={refreshStatistics}
        childId={childId}
      />
    </View>
  )
}
export default BabyTrackerWeightListItem
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
    backgroundColor: 'red',
  },

  text: {
    marginBottom: 25,
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
  },

  box: {
    borderRadius: 10,
    elevation: 50,
    borderColor: 'red',
    backgroundColor: 'white',
    padding: 25,
  },
})
