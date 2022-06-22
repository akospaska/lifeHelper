import { View } from 'react-native'

import { Center } from 'native-base'

import { Box, FlatList, HStack, VStack, Text, Flex } from 'native-base'

import { Icon } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const BabyTrackerFlatList = ({ data }) => {
  return (
    <Center>
      <Text>2020/06/19</Text>
      <FlatList
        borderColor={'coolGray.200'}
        marginTop={1}
        borderWidth={1}
        borderRadius={5}
        padding={1}
        data={data}
        renderItem={({ item }) => (
          <Box
            borderBottomWidth="1"
            _dark={{
              borderColor: 'gray.600',
            }}
            borderColor="coolGray.200"
            width={wp('90%')}
          >
            <HStack space={3} justifyContent="space-between">
              <VStack>
                <Flex flexDirection={'row'} justifyContent="space-evenly" alignContent={'center'} marginBottom={1}>
                  {getIconComponentByActionId(item.actionId)}
                  <Text
                    _dark={{
                      color: 'warmGray.50',
                    }}
                    color="coolGray.800"
                    bold
                    marginTop={hp('1%')}
                  >
                    {item.actionName}
                  </Text>
                </Flex>
              </VStack>
              <Flex>
                <Text
                  color="coolGray.600"
                  _dark={{
                    color: 'warmGray.200',
                  }}
                >
                  {`Duration${item.duration}`}
                </Text>
                <Text
                  fontSize="xs"
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  color="coolGray.800"
                  alignSelf="flex-start"
                >
                  {item.timeStamp}
                </Text>
              </Flex>
            </HStack>
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />
    </Center>
  )
}

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

export default BabyTrackerFlatList
