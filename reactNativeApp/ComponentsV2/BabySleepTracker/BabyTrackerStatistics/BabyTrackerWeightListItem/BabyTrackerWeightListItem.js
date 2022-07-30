import { Flex, View, Text } from 'native-base'

const BabyTrackerWeightListItem = (props) => {
  const { data, refreshStatistics } = props
  return (
    <View borderWidth={1} borderColor={'gray.500'} width={wp('80%')} marginBottom={hp('1%')} padding={hp('1%')} borderRadius={20}>
      <Flex flexDirection={'row'} justifyContent="space-around">
        <Text>Weight:{data.weight} g</Text>
        <Text>Date:{getDatePickerInitialDateFormat(data.creationDate)}</Text>
      </Flex>
    </View>
  )
}
export default BabyTrackerWeightListItem
