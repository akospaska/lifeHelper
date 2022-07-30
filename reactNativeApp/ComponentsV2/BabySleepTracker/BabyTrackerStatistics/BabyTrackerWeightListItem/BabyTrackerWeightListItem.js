import { Flex, View, Text, Pressable } from 'native-base'

import { getDatePickerInitialDateFormat } from '../../../Utils/timeFormatter'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const BabyTrackerWeightListItem = (props) => {
  const { data, refreshStatistics, childId } = props
  return (
    <Pressable
      borderWidth={1}
      borderColor={'gray.500'}
      width={wp('80%')}
      marginBottom={hp('1%')}
      padding={hp('1%')}
      borderRadius={20}
      onPress={() => {
        console.log('asdasd')
      }}
    >
      <Flex flexDirection={'row'} justifyContent="space-around">
        <Text>Date:{getDatePickerInitialDateFormat(data.date)}</Text>
        <Text>Weight:{data.weight} g</Text>
      </Flex>
    </Pressable>
  )
}
export default BabyTrackerWeightListItem
