import * as React from 'react'
import { Box, HStack, VStack, Text, Pressable, Flex, Center } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { View } from 'react-native'

import GroceySubListItem from './GrocerySubListItem/GrocerySubListItem'

const GroceryListItem = (props) => {
  const { id, name, priority, groceryItemList } = props.data

  const { setOpenedCategoryId, isOpen, scrollToPosition, coord, setCreateModalIsOpen, setCateGoryIdForOpenModal } =
    props

  return (
    <Box
      key={id}
      bg="#44403c"
      py="4"
      px="3"
      rounded="md"
      alignSelf="center"
      width={400}
      maxWidth="100%"
      style={{ marginTop: 40, width: wp('80%') }}
    >
      <HStack justifyContent="space-between">
        <Box justifyContent="space-between">
          <VStack space="2">
            <Text color="white" fontSize="lg">
              {name}
            </Text>
          </VStack>
          <Flex flexDirection={'row'} alignContent={'center'}>
            <Pressable
              rounded="sm"
              bg="#78716c"
              alignSelf="flex-start"
              py="4"
              px="3"
              onPress={() => {
                setOpenedCategoryId(isOpen ? 0 : id)
              }}
            >
              <Text textTransform="uppercase" fontSize="sm" fontWeight="bold" color="white">
                {isOpen ? 'Hide    Items!' : 'Show Items!'}
              </Text>
            </Pressable>
            <Pressable
              marginLeft={wp('1%')}
              marginTop={hp('1%')}
              rounded="sm"
              bg="green.500"
              alignSelf="flex-start"
              height={hp('6%')}
              width={wp('15%')}
              onPress={() => {
                console.log('hello bello')
                setCateGoryIdForOpenModal(id)
                setCreateModalIsOpen(true)
              }}
            >
              <Center>
                <Text
                  textTransform="uppercase"
                  fontWeight="bold"
                  color="white"
                  backgroundColor={'red.500'}
                  fontSize={'3xl'}
                >
                  +
                </Text>
              </Center>
            </Pressable>
          </Flex>
        </Box>
        {props.data.icon == 'fast-food' ? (
          <Ionicons name={props.data.icon} size={90} color="white" />
        ) : (
          <FontAwesome5 name={props.data.icon} size={90} color="white" />
        )}
      </HStack>
      {groceryItemList.map((a, b) => {
        return (
          <View key={a.id} style={{ display: !isOpen ? 'none' : 'flex' }}>
            <GroceySubListItem data={a} fake={props.fake} setFake={props.setFake} forceRefresh={props.forceRefresh} />
          </View>
        )
      })}
    </Box>
  )
}

export default GroceryListItem
