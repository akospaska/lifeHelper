import { Flex, Center } from 'native-base'
import React from 'react'

import { Pressable, Text, View } from 'react-native'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { Icon } from 'react-native-elements'

const BabyTrackerListItem = (props) => {
  const { data } = props
  return (
    <View style={{ borderColor: '#98A5A9', borderWidth: 1, marginBottom: hp('3%'), padding: 5, borderRadius: 10 }}>
      <Center>
        <Text>2020-06.25</Text>
        {data.map((a) => {
          const { actionId, actionName, duration, startTime, endTime } = a
          return (
            <Pressable onPress={() => console.log('asdasdasd')}>
              <Flex
                borderColor={'gray.500'}
                borderWidth={1}
                borderRadius={5}
                width={wp('90%')}
                marginBottom={hp('1%')}
                flexDirection={'row'}
                justifyContent="space-between"
                alignContent={'center'}
              >
                <View>
                  {getIconComponentByActionId(actionId)}
                  <Text>{actionName}</Text>
                </View>
                <Flex width={wp('60%')} flexDirection="row" justifyContent={'space-between'}>
                  <View>
                    <Text>Duration:</Text>
                    <Text>{duration}</Text>
                  </View>
                  <View>
                    <Text>Start:</Text>
                    <Text>{startTime}</Text>
                  </View>
                  <View>
                    <Text>Ends:</Text>
                    <Text>{endTime}</Text>
                  </View>
                </Flex>
              </Flex>
            </Pressable>
          )
        })}
      </Center>
    </View>
  )
}

export default BabyTrackerListItem

function getIconComponentByActionId(actionId) {
  let iconElement

  switch (actionId) {
    case 1:
      iconElement = <Icon raised name="bedtime" type="material-icons" color="#f50" size={10} />
      break
    case 2:
      iconElement = <Icon reverse name="ios-woman" type="ionicon" color="green" size={10} />
      break
    case 3:
      iconElement = <Icon reverse name="ios-walk-outline" type="ionicon" color="purple" size={10} />
      break
    case 4:
      iconElement = <Icon reverse name="ios-bed-outline" type="ionicon" color="#517fa4" size={10} />
      break
  }

  return iconElement
}
