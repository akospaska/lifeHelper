import * as React from 'react'
import { Box, HStack, VStack, Text, Pressable } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { View } from 'react-native'

import GroceySubListItem from './GrocerySubListItem/GrocerySubListItem'

const GroceryListItem = (props) => {
  const { id, name, priority, groceryItemList } = props.data

  const { setOpenedCategoryId, isOpen, scrollToPosition, coord } = props

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
          <Pressable
            rounded="sm"
            bg="#78716c"
            alignSelf="flex-start"
            py="4"
            px="3"
            onPress={() => /* setHidden(!hidden) */ {
              setOpenedCategoryId(isOpen ? 0 : id)
            }}
          >
            <Text textTransform="uppercase" fontSize="sm" fontWeight="bold" color="white">
              Show Items!
            </Text>
          </Pressable>
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
