import React, { useState } from 'react'

import { TextInput } from 'react-native'

import { Flex, FormControl, Modal, Button, HStack, Pressable } from 'native-base'

import DateTimePicker from '../../../Utils/DateTimePicker/DateTimePicker'
import { getApiGatewayInstance } from '../../../Api/getApiGatewayInstance/getApiGatewayInstance'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { displayErrorMessageByErrorStatusCode } from '../../../Utils/GlobalErrorRevealer/GlobalErrorRevealer'

const RegisterChildModal = (props) => {
  const { modalVisible, setModalVisible, refreshChildrenFn } = props

  const [newChildName, setNewChildName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [isActualChildDefault, setIsActualChildDefault] = useState(false)

  const [showDateTimePicker, setShowDateTimePicker] = useState(false)

  const sendRegisterChildRequest = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      await apiGateway.post('api/babytracker/children/registerchild', { name: newChildName })

      refreshChildrenFn()
      setModalVisible(false)
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
        <DateTimePicker
          modalVisible={showDateTimePicker}
          setModalVisible={setShowDateTimePicker}
          selectedDate={birthDate}
          setSelectedDate={setBirthDate}
        />
        <Modal.Content>
          <Modal.CloseButton />

          <Modal.Header>Register Child</Modal.Header>

          <Modal.Body>
            <FormControl mt="3">
              <FormControl.Label>Name</FormControl.Label>

              <TextInput
                style={{ color: 'black', borderColor: 'grey', borderWidth: 1, height: 50, borderRadius: 5 }}
                onChangeText={setNewChildName}
                value={newChildName}
              />
            </FormControl>
            <Flex flexDirection={'row'} justifyContent={'space-between'}>
              {/*    <Text>Birth Date: {birthDate}</Text>
              <Icon
                reverse
                name="ios-calendar-outline"
                type="ionicon"
                color="purple"
                size={20}
                onPress={() => {
                  setShowDateTimePicker(true)
                }}
              /> */}
            </Flex>
            <HStack alignItems="center" space={4}>
              {/*   <Text>Default</Text>
              <Switch
                size="sm"
                onToggle={() => setIsActualChildDefault(!isActualChildDefault)}
                isChecked={isActualChildDefault}
              /> */}
            </HStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                sendRegisterChildRequest()
                //setModalVisible(false)
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default RegisterChildModal
