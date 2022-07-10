import React from 'react'

import { Button, Modal, FormControl, View } from 'native-base'
import { useState } from 'react'
import { Picker, TextInput, StyleSheet, Text } from 'react-native'

import { useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { getApiGatewayInstance } from '../../../Api/getApiGatewayInstance/getApiGatewayInstance'

import AsyncStorage from '@react-native-async-storage/async-storage'

const CreateNewItem = (props) => {
  const selectedGroceryGroupId = props.selectedGroceryGroupId

  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [categories, setCategories] = useState([])
  const [itemName, setItemName] = useState('')

  const { setCreateModalIsOpen, setCateGoryIdForOpenModal, createModalIsOpen, cateGoryIdForOpenModal } = props

  const createNewItemRequest = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    const response = await apiGateway.post('api/grocery/groceryitem/creategroceryitem', {
      groupId: selectedGroceryGroupId,
      categoryId: selectedCategory,
      groceryItemName: itemName,
    })

    try {
      setShowModal(false)
      setSelectedCategory(categories[0].id)
      setItemName('')
      props.forceRefresh()

      props.setOpenedCategoryId(selectedCategory)
    } catch (error) {
      console.log(error)
    }
  }

  const getCategories = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    const response = await apiGateway.post('api/grocery/category/getcategories', {
      groupId: selectedGroceryGroupId,
    })

    try {
      setCategories(response.data)

      setSelectedCategory(response.data[0].id)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (createModalIsOpen) {
      console.log(`I am the create modal ${cateGoryIdForOpenModal}`)
      setSelectedCategory(cateGoryIdForOpenModal)
    }
  }, [createModalIsOpen])

  useEffect(() => {
    getCategories()
  }, [props.fake])

  return (
    <View style={{ width: wp('38%'), marginRight: wp('8%') }}>
      <Button onPress={() => setShowModal(true)} backgroundColor={'#a8a29e'} style={{ justifyContent: 'flex-start' }}>
        <Text style={{ textAlignVertical: 'center', textAlign: 'center', color: 'white' }}> Create New Item</Text>
      </Button>

      <Modal
        isOpen={showModal || createModalIsOpen}
        onClose={() => {
          setCreateModalIsOpen(false)
          setShowModal(false)
          setCateGoryIdForOpenModal(0)
        }}
      >
        <Modal.Content maxWidth="400px" backgroundColor={'#292524'}>
          <Modal.CloseButton />
          <Modal.Header>
            <Text style={{ color: 'white' }}>Create New Item</Text>
          </Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>
                <Text style={{ color: 'white' }}>Name:</Text>
              </FormControl.Label>
              <TextInput style={styles.input} onChangeText={setItemName} value={itemName} />
            </FormControl>
            <Text style={{ color: 'white' }}>Categories:</Text>
            <Picker
              selectedValue={selectedCategory}
              style={{
                height: 50,
                width: 150,
                color: 'white',
              }}
              onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
            >
              {categories.map((a, b) => {
                return <Picker.Item key={a.id} label={a.name} value={a.id} />
              })}
            </Picker>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#292524' }}>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setCreateModalIsOpen(false)
                  setShowModal(false)
                  setCateGoryIdForOpenModal(0)
                }}
              >
                Cancel
              </Button>
              <Button
                style={{
                  backgroundColor:
                    selectedCategory == 0 || itemName == '' ? 'rgb(252, 88, 76)asd' : 'rgba(6,182,212,255)',
                }}
                disabled={selectedCategory == 0 || itemName == '' ? true : false}
                onPress={async () => {
                  await createNewItemRequest()
                  setCreateModalIsOpen(false)
                  setShowModal(false)
                  setCateGoryIdForOpenModal(0)
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

export default CreateNewItem

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    backgroundColor: '#fff',
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
    color: '#fff',
    borderRadius: 5,
  },
  createButton: { height: 40, borderWidth: 1, padding: 10, width: 300, fontSize: 20, alignContent: 'center' },
  headerText: { padding: 10, width: 300, fontSize: 30 },
})
