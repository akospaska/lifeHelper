import * as React from 'react'
import { NativeBaseProvider, Box, HStack, VStack, Text, Pressable, Image, ScrollView, Button } from 'native-base'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { View, Dimensions } from 'react-native'

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit'

const getLast15Days = () => {
  let last15daysArray = []
  for (let index = 0; index < 20; index++) {
    let date = new Date()

    date.toLocaleDateString({
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

    date.setDate(date.getDate() - index)

    const month = date.getMonth()
    const formattedMonth = month > 9 ? month : `0${month}`
    const day = date.getDate()
    const formattedDate = day > 9 ? day : `0${day}`

    const result = '|' + formattedMonth + '-' + formattedDate + '|'

    last15daysArray.push(result)
  }
  return last15daysArray
}

console.log(getLast15Days())

const WeightTrackerChart = ({ navigation }) => {
  return (
    <View>
      <Text>Bezier Line Chart</Text>

      <ScrollView horizontal={true}>
        <LineChart
          data={{
            labels: getLast15Days(),
            datasets: [
              {
                data: [77, 74, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 76, 77, 75, 74, 73, 76], // dataset
              },
              {
                data: [70], // min
                withDots: false,
              },
              {
                data: [80], // max
                withDots: false,
              },
            ],
          }}
          width={Dimensions.get('window').width}
          height={380}
          yAxisSuffix="kg"
          yAxisInterval={1}
          chartConfig={{
            fromZero: false,
            backgroundColor: '#292524',
            backgroundGradientFrom: '#292524',
            backgroundGradientTo: '#292524',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: 'white',
            },
          }}
          bezier
          style={{
            marginVertical: 18,
            borderRadius: 0,
          }}
        />
      </ScrollView>
    </View>
  )
}
export default WeightTrackerChart
