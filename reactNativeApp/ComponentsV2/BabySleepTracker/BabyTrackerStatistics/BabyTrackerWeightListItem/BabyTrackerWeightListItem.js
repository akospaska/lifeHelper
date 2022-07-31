import { Flex, View, Text, Pressable } from 'native-base'
import { useState } from 'react'

import { getDatePickerInitialDateFormat } from '../../../Utils/timeFormatter'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import BabyTrackerWeightListItemUpdateModal from './BabyTrackerWeightListItemUpdateModal/BabyTrackerWeightListItemUpdateModal'

const BabyTrackerWeightListItem = (props) => {
  const { data, refreshStatistics, childId } = props
  const [modalVisible, setModalVisible] = useState(false)
  return (
    <View>
      <Pressable
        _pressed={{
          backgroundColor: 'gray.100',
        }}
        borderTopRadius="0"
        borderLeftRadius={12}
        borderRightRadius={12}
        borderWidth="1"
        borderColor={'gray.200'}
        width={wp('80%')}
        marginBottom={hp('1%')}
        padding={hp('1%')}
        height={hp('10%')}
        onPress={() => {
          setModalVisible(true)
          console.log(modalVisible)
        }}
      >
        <Flex flexDirection={'row'} justifyContent="space-around">
          <Flex>
            <Text style={{ fontSize: 20 }}>Date</Text>
            <Text style={{ fontSize: 20 }}>{getDatePickerInitialDateFormat(data.date)}</Text>
          </Flex>

          <Flex>
            <Text style={{ marginBottom: 10, fontSize: 20 }}>Weight g</Text>
            <Text style={{ fontSize: 20 }}>{data.weight}</Text>
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
