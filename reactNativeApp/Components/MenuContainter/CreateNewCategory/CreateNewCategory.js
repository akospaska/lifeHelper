import React from 'react'
import { Button, Modal, FormControl, Input, Center, NativeBaseProvider, View, Text } from 'native-base'
import { TextInput, StyleSheet } from 'react-native'
import { useState } from 'react'
import EmojiSelector, { Categories } from 'react-native-emoji-selector'
import { Ionicons } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useEffect } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import axios from 'axios'

import { Picker } from 'react-native'

import { getApiGatewayInstance } from '../../../ComponentsV2/Api/getApiGatewayInstance/getApiGatewayInstance'

const CreateNewCategory = (props) => {
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [priority, setPriority] = useState(1)

  const [icons, setIcons] = useState([])

  const getIcons = async () => {
    const apiGateway = getApiGatewayInstance('')

    const axiosResponse = await apiGateway.get('api/grocery/category/geticons')

    try {
      setIcons(axiosResponse.data)
    } catch (error) {
      console.log(error)
    }
  }

  const createNewCategory = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    await apiGateway.post('api/grocery/category/createcategory', {
      groupId: props.selectedGroceryGroupId,
      priority: priority,
      icon: icon,
      newCategoryName: name,
    })

    try {
      setShowModal(false)
      props.forceRefresh()

      setName('')
      setPriority(1)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getIcons()
  }, [])

  return (
    <View style={{ width: wp('45.5%') }}>
      <View style={{ /* width: wp("38%"), marginRight: wp("8%")  */ flex: 1 }}>
        <Button onPress={() => setShowModal(true)} backgroundColor={'#a8a29e'} style={{ justifyContent: 'flex-start' }}>
          <Text style={{ alignSelf: 'flex-end', color: 'white' }}> Create new category</Text>
        </Button>
      </View>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px" backgroundColor={'#292524'} color="white">
          <Modal.CloseButton />
          <Modal.Header>
            <Text style={{ color: 'white' }}>Create New Category</Text>
          </Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Name</FormControl.Label>
              <TextInput style={styles.input} onChangeText={setName} value={name} />
            </FormControl>
            <Text style={{ color: 'white' }}>Priority:</Text>
            <Picker
              selectedValue={priority}
              style={{
                height: 50,
                width: 150,
                color: 'white',
              }}
              onValueChange={(itemValue, itemIndex) => setPriority(itemValue)}
            >
              <Picker.Item label="1" value={1} />
              <Picker.Item label="2" value={2} />
              <Picker.Item label="3" value={3} />
              <Picker.Item label="4" value={4} />
              <Picker.Item label="5" value={5} />
            </Picker>
            <Text style={{ color: 'white' }}>Icons::</Text>
            <View>
              <View width={20}>
                <Ionicons
                  name="fast-food"
                  size={50}
                  color={icon == 'fast-food' ? 'white' : 'grey'}
                  onPress={() => setIcon('fast-food')}
                />
              </View>
              {icons.map((a, b) => {
                return (
                  <View key={b} width={20} marginBottom={2}>
                    <FontAwesome5
                      name={a}
                      size={50}
                      color={icon == a ? 'white' : 'grey'}
                      onPress={() => {
                        setIcon(a)
                      }}
                    />
                  </View>
                )
              })}
            </View>
          </Modal.Body>
          <Modal.Footer backgroundColor="red">
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false)
                }}
              >
                Cancel
              </Button>
              <Button
                style={{ backgroundColor: icon == '' || name == '' ? 'rgb(252, 88, 76)asd' : 'rgba(6,182,212,255)' }}
                disabled={icon == '' || name == '' ? true : false}
                onPress={() => {
                  createNewCategory()
                }}
              >
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  )
}

export default CreateNewCategory

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#828282',
    padding: 10,
    width: wp('65%'),
    fontSize: 20,
    marginBottom: 20,
    color: 'white',
    borderRadius: 5,
  },
  createButton: { height: 40, borderWidth: 1, padding: 10, width: 300, fontSize: 20, alignContent: 'center' },
  headerText: { padding: 10, width: 300, fontSize: 30 },
})
