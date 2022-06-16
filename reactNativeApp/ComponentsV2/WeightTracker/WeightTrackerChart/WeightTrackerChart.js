import * as React from 'react'
import { useState, useEffect } from 'react'

import { Text } from 'native-base'

import { View } from 'react-native'

import { LineChart } from 'react-native-chart-kit'

const fakeApiData = [
  { day: '07', weight: 71, id: 1 },
  { day: '08', weight: 73, id: 2 },
  { day: '09', weight: 73, id: 2 },
  { day: '10', weight: 75, id: 3 },
  { day: '11', weight: 74, id: 4 },
  { day: '12', weight: 73, id: 5 },
  { day: '13', weight: 74, id: 6 },
  { day: '14', weight: 75, id: 7 },
  { day: '15', weight: 76, id: 8 },
  { day: '16', weight: 77, id: 9 },
]

const getLast15Days = () => {
  let last15daysArray = []
  for (let index = 0; index < 9; index++) {
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

    const result = formattedDate

    last15daysArray.push(result)
  }
  return last15daysArray
}

const extractWeights = (apiData) => {
  let weights = []

  apiData.forEach((element) => {
    weights.push(element.weight)
  })
  return weights
}

const extractDays = (apiData) => {
  let days = []

  apiData.forEach((element) => {
    days.push(element.day)
  })

  return days
}

const WeightTrackerChart = (props) => {
  const [apiData, setApiData] = useState([])

  const [weights, setWeights] = useState([])
  const [days, setDays] = useState([])

  useEffect(() => {
    if (props.chartData.length > 0) {
      setApiData(props.chartData)
      setWeights(extractWeights(apiData))
      setDays(extractDays(apiData))
    }
  }, [apiData])

  return (
    <View>
      <Text>Bezier Line Chart</Text>

      <LineChart
        onDataPointClick={(e) => {
          console.log('asdasd')
          console.log(e.value)
        }}
        data={{
          labels: days,
          datasets: [
            {
              data: weights, // dataset
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
        width={400}
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
    </View>
  )
}
export default WeightTrackerChart
