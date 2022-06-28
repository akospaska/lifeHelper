import { View } from 'react-native'
import { ScrollView } from 'native-base'

import { Ionicons } from '@expo/vector-icons'

import {
  Box,
  FlatList,
  Heading,
  Avatar,
  HStack,
  VStack,
  Text,
  Spacer,
  Center,
  NativeBaseProvider,
  Select,
  CheckIcon,
  Flex,
  Pressable,
} from 'native-base'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { Icon } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import React, { useEffect, useState } from 'react'

import BabyTrackerStatisticsChart from './BabyTrackerStatisticsChart/BabyTrackerStatisticsChart'
import BabyTrackerListItem from './BabyTrackerListItem/BabyTrackerListItem'
import { getApiGatewayInstance } from '../../Api/getApiGatewayInstance/getApiGatewayInstance'

const BabyTrackerStatistics = (props) => {
  const [actualPage, setActualPage] = useState(0)
  const [service, setService] = useState(0)

  const { selectedKidId } = props
  const [actualDate, setActualDate] = useState({})

  const [statisticTypes, setStatisticTypes] = useState([])
  const [selectedStatisticId, setSelectedStatisticId] = useState(0)

  const [fetchedStatistics, setFetchedStatistics] = useState([])

  const { showCharts, actionStatuses } = props

  const getStatisticTypes = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      const axiosResponse = await apiGateway.get('api/babytracker/statistics/statistics/getstatistictypes')
      const statisticTypes = axiosResponse.data

      setStatisticTypes(statisticTypes)
      setSelectedStatisticId(statisticTypes[0].id)
    } catch (error) {
      console.log(error)
    }
  }

  const getSelectedStatistics = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)
    console.log({
      statisticsTypeId: 1,
      childId: selectedKidId,
      intervallStart: actualPage,
      intervallEnd: actualPage + 7,
    })
    try {
      const axiosResponse = await apiGateway.post('api/babytracker/statistics/statistics/getstatistics', {
        statisticsTypeId: 1,
        childId: selectedKidId,
        intervallStart: actualPage,
        intervallEnd: actualPage + 7,
      })

      const statistics = axiosResponse.data

      setFetchedStatistics(statistics)
    } catch (error) {
      console.log('fetch error')
      // console.log(error.response)
    }
  }

  function getTodayAnd7DayMinus(actualPage = 0) {
    var today = new Date()
    var thisWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - actualPage)

    const thisFullDate = `${thisWeek.getFullYear()}-${thisWeek.getMonth() + 1}-${thisWeek.getDate()}`

    var today2 = new Date()
    var lastWeek = new Date(today2.getFullYear(), today2.getMonth(), today2.getDate() - (actualPage + 7))

    const newWeekFullDate = `${lastWeek.getFullYear()}-${lastWeek.getMonth() + 1}-${lastWeek.getDate()}`

    const result = { today: thisFullDate, lastWeek: newWeekFullDate }

    setActualDate(result)
    console.log(result)
  }
  useEffect(() => {
    getTodayAnd7DayMinus(actualPage)
  }, [actualPage])

  useEffect(async () => {
    await getSelectedStatistics()
  }, [selectedStatisticId, actualPage])

  useEffect(async () => {
    getStatisticTypes()
  }, [])

  return (
    <Center marginTop={10}>
      <Box w="3/4" maxW="300" marginTop={hp('1%')}>
        <Select
          selectedValue={selectedStatisticId}
          minWidth="200"
          accessibilityLabel="Choose Service"
          placeholder="Choose Service"
          _selectedItem={{
            bg: 'teal.600',
            endIcon: <CheckIcon size="5" />,
          }}
          mt={1}
          onValueChange={(itemValue) => setSelectedStatisticId(itemValue)}
        >
          {statisticTypes.map((a) => {
            return <Select.Item label={a.statisticName} value={a.id} />
          })}
        </Select>
        <Center>
          <Flex flexDirection={'row'} justifyContent={'space-between'} width={wp('75%')}>
            <Pressable onPress={() => setActualPage(actualPage + 7)}>
              <Icon reverse name="arrow-back-outline" type="ionicon" color="#517fa4" size={10} />
            </Pressable>
            <Text>{`${actualDate?.lastWeek} || ${actualDate?.today}`}</Text>
            <Pressable
              onPress={() => {
                if (actualPage <= 0) {
                  console.log('nonono')
                } else {
                  setActualPage(actualPage - 7)
                }
              }}
            >
              <Icon reverse name="arrow-forward-outline" type="ionicon" color="#517fa4" size={10} />
            </Pressable>
          </Flex>
        </Center>
      </Box>
      <ScrollView height={hp('60%')}>
        {!showCharts ? (
          <React.Fragment>
            {fetchedStatistics.map((a, b) => (
              <BabyTrackerListItem data={a} />
            ))}
          </React.Fragment>
        ) : (
          <View>
            <BabyTrackerStatisticsChart />
            <BabyTrackerStatisticsChart />
            <BabyTrackerStatisticsChart />
            <BabyTrackerStatisticsChart />
          </View>
        )}
      </ScrollView>
    </Center>
  )
}

export default BabyTrackerStatistics
