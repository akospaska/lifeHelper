import * as React from 'react'
import { useEffect } from 'react'
import { Text, ScrollView, Spinner, HStack, Heading } from 'native-base'

import { useState, useRef } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { View, Pressable } from 'react-native'

import GroceryListItem from './GroceryListItem/GroceryListItem'

import MenuContainer from '../../Components/MenuContainter/MenuContainer'
import { Picker } from 'react-native'

import { getApiGatewayInstance } from '../Api/getApiGatewayInstance/getApiGatewayInstance'

let elementStartingCoords = []

const GroceryList = () => {
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false)
  const [cateGoryIdForOpenModal, setCateGoryIdForOpenModal] = useState(0)

  useEffect(() => {
    console.log('cateGoryIdForOpenModal has been changed')
  }, [cateGoryIdForOpenModal])

  const myScroll = useRef()
  const [openedCategoryId, setOpenedCategoryId] = useState(0)

  const [fake, setFake] = useState(false)
  const [groceryList, setGroceryList] = useState([])
  const [storedGroceryList, setStoredGroceryList] = useState([])

  const [groceryGroups, setGroceryGroups] = useState([])
  const [selectedGroceryGroupId, setSelectedGroceryGroupId] = useState(0)

  const [isDatabaseError, setIsDatabaseError] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const forceRefresh = () => {
    setFake(!fake)
  }

  const getGroceryGroups = async () => {
    setIsDatabaseError(false)
    setIsLoading(true)
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      const response = await apiGateway.get('api/grocery/group/getgroups')
      setGroceryGroups(response.data)
      setSelectedGroceryGroupId(response.data[0].id)
      getCategoriesWithItems()
    } catch (error) {
      setIsLoading(false)
      setIsDatabaseError(true)
    }
  }

  const getCategoriesWithItems = async () => {
    setIsDatabaseError(false)
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      const response = await apiGateway.post('api/grocery/category/getcategorieswithitems', {
        groupId: selectedGroceryGroupId,
      })

      setIsLoading(false)

      setGroceryList(response.data)
      setIsDatabaseError(false)
    } catch (error) {
      console.log(error.response.data)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getGroceryGroups()
  }, [fake])

  useEffect(() => {
    setStoredGroceryList(groceryList)
  }, [groceryList])

  useEffect(() => {
    if (openedCategoryId > 0) {
      try {
        const x = elementStartingCoords.find((element) => element.id === openedCategoryId)

        scrollToPosition(x.startingCoord)
      } catch (err) {
        console.log(err)
      }
    }
  }, [openedCategoryId])

  useEffect(() => {
    getCategoriesWithItems()
  }, [selectedGroceryGroupId])

  const scrollToPosition = (coord) => {
    myScroll.current.scrollTo({ x: 0, y: coord, animated: true })
  }

  return (
    <React.Fragment>
      <ScrollView
        style={{ margin: 0, marginTop: wp('5%'), backgroundColor: '#292524', height: wp('100%') }}
        ref={myScroll}
      >
        <Picker
          selectedValue={selectedGroceryGroupId}
          style={{
            height: 50,
            width: 250,
            color: 'white',
            position: 'absolute',
            left: wp('30%'),
            top: wp('2%'),
          }}
          onValueChange={(itemValue, itemIndex) => setSelectedGroceryGroupId(itemValue)}
        >
          {groceryGroups.map((a) => {
            return <Picker.Item label={a.groceryGroupName} value={a.id} />
          })}
        </Picker>

        {storedGroceryList.length > 0 ? (
          storedGroceryList.map((a, b) => {
            if (a.groceryItemList.length > 0) {
              return (
                <Pressable
                  key={a.id}
                  style={{ marginTop: b === 0 ? 20 : 0 }}
                  onLayout={(event) => {
                    const layout = event.nativeEvent.layout

                    const indexOfCoordInArray = elementStartingCoords.findIndex((element) => element.id === a.id)

                    if (indexOfCoordInArray < 0) {
                      return elementStartingCoords.push({ id: a.id, startingCoord: layout.y })
                    }

                    elementStartingCoords[indexOfCoordInArray].startingCoord = layout.y
                  }}
                  onPress={() => {
                    console.log('asdasd')
                    const x = elementStartingCoords.find((element) => element.id === a.id)

                    scrollToPosition(x.startingCoord)
                  }}
                >
                  <GroceryListItem
                    setCreateModalIsOpen={setCreateModalIsOpen}
                    setCateGoryIdForOpenModal={setCateGoryIdForOpenModal}
                    data={a}
                    fake={fake}
                    setFake={setFake}
                    forceRefresh={forceRefresh}
                    setOpenedCategoryId={setOpenedCategoryId}
                    isOpen={a.id === openedCategoryId}
                    scrollToPosition={scrollToPosition}
                    coord={elementStartingCoords.find((element) => element.id === a.id)}
                  />
                </Pressable>
              )
            }
          })
        ) : (
          <Text style={{ color: 'red' }}></Text>
        )}
      </ScrollView>
      <HStack space={2} justifyContent="center" bg={'#292524'} height="8">
        {isLoading ? (
          <View style={{ flexDirection: 'row' }}>
            <Spinner accessibilityLabel="Loading posts" />
            <Heading color="primary.500" fontSize="md">
              <Text>Loading</Text>
            </Heading>
          </View>
        ) : (
          console.log()
        )}
        {isDatabaseError ? <Text style={{ color: 'red' }}>DATABASE ERROR YOLOOO!!!</Text> : console.log()}
      </HStack>

      {selectedGroceryGroupId != 0 ? (
        <MenuContainer
          createModalIsOpen={createModalIsOpen}
          cateGoryIdForOpenModal={cateGoryIdForOpenModal}
          fake={false}
          setFake={setFake}
          forceRefresh={forceRefresh}
          selectedGroceryGroupId={selectedGroceryGroupId}
          setOpenedCategoryId={setOpenedCategoryId}
          setCreateModalIsOpen={setCreateModalIsOpen}
          setCateGoryIdForOpenModal={setCateGoryIdForOpenModal}
        />
      ) : (
        console.log()
      )}
    </React.Fragment>
  )
}
export default GroceryList
