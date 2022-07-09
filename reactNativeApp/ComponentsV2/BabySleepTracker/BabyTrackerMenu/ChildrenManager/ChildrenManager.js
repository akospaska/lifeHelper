import React, { useEffect, useState } from 'react'

import {
  Box,
  Heading,
  Center,
  ScrollView,
  Flex,
  Select,
  CheckIcon,
  Menu,
  Pressable,
  useToast,
  HamburgerIcon,
  FormControl,
  Input,
  Modal,
  Button,
  Text,
  VStack,
  HStack,
  Switch,
} from 'native-base'
import ChildChooser from '../../ChildChooser/ChildChooser'

import { Icon } from 'react-native-elements'

import DateTimePicker from '../../../Utils/DateTimePicker/DateTimePicker'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { getApiGatewayInstance } from '../../../Api/getApiGatewayInstance/getApiGatewayInstance'

import { displayErrorMessageByErrorStatusCode } from '../../../Utils/GlobalErrorRevealer/GlobalErrorRevealer'

const ChildrenManager = (props) => {
  const toast = useToast()
  const [selectedKidId, setSelectedKidId] = useState(0)
  const { modalVisible, setModalVisible, children, refreshChildrenFn } = props
  const [removeChildVisibleCounter, setRemoveChildVisibleCounter] = useState(0)
  const [actualChildName, setActualChildName] = useState('')
  const [isActualChildDefault, setIsActualChildDefault] = useState(false)

  const [showDateTimePicker, setShowDateTimePicker] = useState(false)

  useEffect(() => {
    const child = children.find((a) => a.id === selectedKidId)

    if (!child) return

    setActualChildName(child.name)
    setIsActualChildDefault(child.isDefault)
  }, [selectedKidId])

  const updateChild = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)
    try {
      const response = await apiGateway.post('api/babytracker/children/updatechild', {
        childId: selectedKidId,
        name: actualChildName,
        isDefault: isActualChildDefault === 1 ? true : false,
      })
      console.log(response.data)
      setModalVisible(false)
    } catch (error) {
      console.log(error.response)
      console.log()
      try {
        displayErrorMessageByErrorStatusCode(toast, Number(error.response.status))
      } catch (error) {
        displayErrorMessageByErrorStatusCode(toast, 418)
      }
    }
  }

  const removeChild = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      const response = await apiGateway.post('api/babytracker/children/removechild', { childId: selectedKidId })

      if (response.data.isValid) {
        setSelectedKidId(0)
        setActualChildName('')
        setIsActualChildDefault(false)
        refreshChildrenFn()
        setModalVisible(false)
      }
    } catch (error) {
      console.log(error.response.data)
      try {
        displayErrorMessageByErrorStatusCode(toast, Number(error.response.status))
      } catch (error) {
        displayErrorMessageByErrorStatusCode(toast, 418)
      }
    }
  }

  return (
    <>
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        avoidKeyboard
        justifyContent="center"
        bottom="4"
        size="lg"
      >
        <DateTimePicker modalVisible={showDateTimePicker} setModalVisible={setShowDateTimePicker} />
        <Modal.Content>
          <Modal.CloseButton />
          <Pressable onPress={() => setRemoveChildVisibleCounter(removeChildVisibleCounter + 1)}>
            <Modal.Header>Children Manager</Modal.Header>
          </Pressable>
          <Modal.Body>
            <Flex flexDirection={'row'} justifyContent={'space-between'}>
              <ChildChooser
                selectedKidId={selectedKidId}
                setSelectedKidId={setSelectedKidId}
                children={children}
                forModal={true}
              />
            </Flex>
            <FormControl mt="3">
              <FormControl.Label>Name</FormControl.Label>
              <Input onChangeText={setActualChildName} value={actualChildName} />
            </FormControl>
            {/*  <Flex flexDirection={'row'} justifyContent={'space-between'}>
              <Text>Birth Date: 1990-11-21</Text>
              <Icon
                reverse
                name="ios-calendar-outline"
                type="ionicon"
                color="purple"
                size={20}
                onPress={() => {
                  setShowDateTimePicker(true)
                }}
              />
            </Flex> */}
            <HStack alignItems="center" space={4}>
              <Text>Default</Text>
              <Switch
                size="sm"
                onToggle={() => setIsActualChildDefault(!isActualChildDefault)}
                isChecked={isActualChildDefault}
              />
            </HStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                updateChild()
              }}
            >
              Save
            </Button>

            {removeChildVisibleCounter > 6 ? (
              <Button
                flex="1"
                onPress={() => {
                  removeChild()
                }}
                bg={'red.500'}
              >
                remove child
              </Button>
            ) : (
              console.log('')
            )}
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default ChildrenManager
