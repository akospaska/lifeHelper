import * as React from 'react'
import { NativeBaseProvider, Box, HStack, VStack, Text, Pressable, Image, Button } from 'native-base'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { View, Dimensions, ScrollView } from 'react-native'

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit'

const a = Array(50)
  .fill()
  .map((_, i) => i)

const getLast15Days = () => {
  let last15daysArray = []
  for (let index = 0; index < 8; index++) {
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
console.log(a)

const WeightTrackerChart = ({ navigation }) => {
  const scrollViewRef = React.useRef()
  const [pos, setPos] = React.useState(0)
  const [arr, setArr] = React.useState(a)

  return (
    <View>
      <Text>Bezier Line Chart</Text>

      <ScrollView
        ref={scrollViewRef}
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        showsVerticalScrollIndicator={true}
        onScroll={(e) => {
          setPos(e.nativeEvent.contentOffset.x)
        }}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}
      >
        <LineChart
          onDataPointClick={(e) => {
            console.log('asdasd')
            console.log(e.value)
          }}
          data={{
            labels: getLast15Days(),
            datasets: [
              {
                data: [77, 75, 76, 77, 75, 74, 73, 76], // dataset
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
          width={2000}
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
