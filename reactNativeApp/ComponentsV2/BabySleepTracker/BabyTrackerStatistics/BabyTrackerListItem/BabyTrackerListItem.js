import { Flex, Center } from 'native-base'
import React from 'react'

import { useState, memo } from 'react'

import { Pressable, Text, View } from 'react-native'

import { MaterialCommunityIcons, Foundation, AntDesign } from '@expo/vector-icons'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import BabyTrackerStatisitcListItemModal from './babyTrackerStatisitcListItemModal/babyTrackerStatisitcListItemModal'
const BabyTrackerListItem = (props) => {
  const { data, refreshStatistics } = props

  const [showUpdateActionModal, setShowUdateActionModal] = useState(false)

  const [selectedAction, setSelectedAction] = useState({})

  return (
    <View style={{ borderColor: '#98A5A9', borderWidth: 1, marginBottom: hp('3%'), padding: 5, borderRadius: 10 }}>
      <Center>
        <Text>{props.data.date}</Text>
        {data.data.map((a, b) => {
          const { id, actionId, comment, duration, startTime, endTime } = a

          return (
            <Pressable
              onPress={() => {
                setSelectedAction(a)
                setShowUdateActionModal(true)
              }}
            >
              <Flex marginBottom={hp('0.5%')} background={'#F4F4F4'} borderRadius={10}>
                <Flex
                  width={wp('90%')}
                  marginBottom={hp('-0.5%')}
                  flexDirection={'row'}
                  justifyContent="space-between"
                  alignContent={'center'}
                  background={'#F4F4F4'}
                  borderRadius={10}
                >
                  <View style={{ marginLeft: wp('3%'), marginBottom: hp('2%'), marginTop: hp('2%') }}>
                    {getIconComponentByActionId(actionId)}
                  </View>
                  <Flex width={wp('60%')} flexDirection="row" justifyContent={'space-between'}>
                    <View style={{ justifyContent: 'center' }}>
                      <Text style={{ fontSize: 20 }}>{duration}</Text>
                    </View>

                    <View style={{ justifyContent: 'center', marginRight: 5, width: 120 }}>
                      <Center>
                        <Flex flexDirection={'row'}>
                          <Text style={{ fontSize: 20, marginRight: 5 }}>{startTime.slice(0, -3)}</Text>
                          <Text style={{ fontSize: 20 }}>-</Text>
                          <Text style={{ fontSize: 20, marginLeft: 5 }}>{endTime.slice(0, -3)}</Text>
                        </Flex>
                      </Center>
                    </View>
                  </Flex>
                </Flex>
                <Text>{comment}</Text>
              </Flex>
            </Pressable>
          )
        })}
      </Center>
      {showUpdateActionModal /* && selectedAction.hasOwnProperty('id')*/ ? (
        <BabyTrackerStatisitcListItemModal
          refreshStatistics={refreshStatistics}
          showModal={showUpdateActionModal}
          setShowModal={setShowUdateActionModal}
          data={selectedAction}
          setSelectedAction={setSelectedAction}
        />
      ) : (
        console.log('')
      )}
    </View>
  )
}

export default memo(BabyTrackerListItem)

function getIconComponentByActionId(actionId) {
  let iconElement

  switch (actionId) {
    case 1:
      iconElement = <MaterialCommunityIcons name="weather-night" size={40} color="#7bc9c8" />
      break
    case 2:
      iconElement = <MaterialCommunityIcons name="mother-nurse" size={40} color="#c97b9c" />
      break
    case 3:
      iconElement = <Foundation name="foot" size={40} color="#7bc990" />
      break
    case 4:
      iconElement = <MaterialCommunityIcons name="bed" size={40} color="#7ba9c9" />
      break
    case 5:
      iconElement = <AntDesign name="apple1" size={40} color="#c97b7b" />
      break
  }

  return iconElement
}

// moon - alvás  cloudy night - elalvás séta a footsteps  reasturant

function getActionNameBasedOnActionId(actionId) {
  let iconElement

  switch (actionId) {
    case 1:
      return 'Sleep'
    case 2:
      return 'BrestFeed'
    case 3:
      return 'Walk'
    case 4:
      return 'Falling asleep'
    case 5:
      return 'Eat'
  }

  return iconElement
}
