import { View, Center } from 'native-base'
import { Dimensions, ScrollView, Text } from 'react-native'
const screenWidth = Dimensions.get('window').width
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { BarChart } from 'react-native-chart-kit'

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43, 22, 44, 66, 120],
    },
  ],
}

const BabyTrackerStatisticsChart = () => {
  return (
    <View
      width={wp('95%')}
      borderColor={'rgba(224, 224, 224, 0.8)'}
      borderWidth={1}
      borderRadius={15}
      padding={2}
      marginTop={2}
    >
      <Center>
        <Text>Last sleeping</Text>
      </Center>
      <ScrollView horizontal={true}>
        <BarChart
          data={data}
          width={wp('200%')}
          height={220}
          chartConfig={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backgroundGradientFrom: 'rgba(255, 255, 255, 0.8)',
            backgroundGradientTo: 'rgba(255, 255, 255, 0.8)',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 0, 0, 0.8)`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, 0.8)`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          verticalLabelRotation={10}
        />
      </ScrollView>
    </View>
  )
}

export default BabyTrackerStatisticsChart
