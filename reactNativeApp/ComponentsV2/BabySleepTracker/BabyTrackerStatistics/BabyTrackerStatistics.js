import { View } from 'react-native'
import { ScrollView } from 'native-base'

import { Box, useToast, Text, Center, Select, CheckIcon, Flex, Pressable } from 'native-base'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { Icon } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import React, { useEffect, useState } from 'react'

import BabyTrackerStatisticsChart from './BabyTrackerStatisticsChart/BabyTrackerStatisticsChart'
import BabyTrackerListItem from './BabyTrackerListItem/BabyTrackerListItem'
import { getApiGatewayInstance } from '../../Api/getApiGatewayInstance/getApiGatewayInstance'
import BabyTrackerStatisticsListItemSkeleton from './BabyTrackerListItem/BabyTrackerStatisticsListItemSkeleton'
import { displayErrorMessageByErrorStatusCode } from '../../Utils/GlobalErrorRevealer/GlobalErrorRevealer'

const BabyTrackerStatistics = (props) => {
  const toast = useToast()
  const [actualPage, setActualPage] = useState(0)
  const [fake, setFake] = useState(fake)

  const { selectedKidId } = props
  const [actualDate, setActualDate] = useState({})

  const [statisticTypes, setStatisticTypes] = useState([])
  const [selectedStatisticId, setSelectedStatisticId] = useState(0)

  const [fetchedStatistics, setFetchedStatistics] = useState([])

  const { showCharts, actionStatuses } = props

  const [isLoading, setIsLoading] = useState(true)

  const getStatisticTypes = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      const axiosResponse = await apiGateway.get('api/babytracker/statistics/statistics/getstatistictypes')
      const statisticTypes = axiosResponse.data

      setStatisticTypes(statisticTypes)
      setSelectedStatisticId(statisticTypes[0].id)
    } catch (error) {
      try {
        displayErrorMessageByErrorStatusCode(toast, Number(error.response.status))
      } catch (error) {
        displayErrorMessageByErrorStatusCode(toast, 418)
      }
    }
  }

  const refreshStatistics = () => {
    setFake(!fake)
  }

  const getSelectedStatistics = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      const axiosResponse = await apiGateway.post('api/babytracker/statistics/statistics/getstatistics', {
        statisticsTypeId: 1,
        childId: selectedKidId,
        intervallStart: actualPage,
        intervallEnd: actualPage + 7,
      })

      const statistics = axiosResponse.data

      console.log(statistics)

      setFetchedStatistics(statistics)
      setIsLoading(false)
    } catch (error) {
      try {
        displayErrorMessageByErrorStatusCode(toast, Number(error.response.status))
      } catch (error) {
        displayErrorMessageByErrorStatusCode(toast, 418)
      }
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
    setIsLoading(true)
    await getSelectedStatistics()
  }, [selectedStatisticId, actualPage, fake])

  useEffect(async () => {
    getStatisticTypes()
  }, [])

  return (
    <Center>
      <Box w="3/4" maxW="300" marginTop={hp('1%')}>
        <Select
          selectedValue={selectedStatisticId}
          minWidth="200"
          accessibilityLabel="Loading"
          placeholder="Loading"
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
            <Pressable
              onPress={() => {
                setIsLoading(true)
                setActualPage(actualPage + 7)
              }}
            >
              <Icon reverse name="arrow-back-outline" type="ionicon" color="#517fa4" size={15} />
            </Pressable>
            <Text>{`${actualDate?.lastWeek} || ${actualDate?.today}`}</Text>
            <Pressable
              disabled={actualPage <= 0}
              onPress={() => {
                if (actualPage <= 0) {
                  console.log('nonono')
                } else {
                  setIsLoading(true)
                  setActualPage(actualPage - 7)
                }
              }}
            >
              <Icon reverse name="arrow-forward-outline" type="ionicon" size={15} color="#517fa4" />
            </Pressable>
          </Flex>
        </Center>
      </Box>
      <ScrollView height={hp('60%')}>
        {isLoading ? (
          <React.Fragment>
            <BabyTrackerStatisticsListItemSkeleton />
            <BabyTrackerStatisticsListItemSkeleton />
            <BabyTrackerStatisticsListItemSkeleton />
            <BabyTrackerStatisticsListItemSkeleton />
          </React.Fragment>
        ) : !showCharts ? (
          <React.Fragment>
            {fetchedStatistics.length === 0 ? (
              <Text>No records</Text>
            ) : (
              fetchedStatistics.map((a, b) => <BabyTrackerListItem data={a} refreshStatistics={refreshStatistics} />)
            )}
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
