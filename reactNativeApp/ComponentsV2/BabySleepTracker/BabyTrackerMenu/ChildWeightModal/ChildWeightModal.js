import React, { useState } from 'react'

import { TextInput } from 'react-native'

import { Flex, FormControl, Modal, Button, HStack, useToast } from 'native-base'

import DateTimePicker from '../../../Utils/DateTimePicker/DateTimePicker'
import { getApiGatewayInstance } from '../../../Api/getApiGatewayInstance/getApiGatewayInstance'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { displayErrorMessageByErrorStatusCode } from '../../../Utils/GlobalErrorRevealer/GlobalErrorRevealer'
import DatePicker from 'react-native-modern-datepicker'
import { getDatePickerInitialDateFormat } from '../../../Utils/timeFormatter'

const ChildWeightModal = (props) => {
  const toast = useToast()
  const { modalVisible, setModalVisible, refreshChildrenFn } = props

  const [setWeight, setNewWeight] = useState(0)
  const [birthDate, setBirthDate] = useState('')

  const [weightDate, setWeightDate] = useState(Math.round(Date.now() / 1000))

  const sendRegisterChildRequest = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      await apiGateway.post('api/babytracker/children/registerchild2', { name: setWeight })

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
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} avoidKeyboard justifyContent="center" bottom="4" size="lg">
        <Modal.Content>
          <Modal.CloseButton />

          <Modal.Header>Register Child</Modal.Header>

          <Modal.Body>
            <DatePicker
              mode="calendar"
              current={getDatePickerInitialDateFormat(weightDate)}
              onSelectedChange={(date) => {
                const y = new Date(date)
                setWeightDate((y.getTime() + 7200000) / 1000)
              }}
            />
            <FormControl mt="3">
              <FormControl.Label>Weight in gramm</FormControl.Label>

              <TextInput
                style={{ color: 'black', borderColor: 'grey', borderWidth: 1, height: 50, borderRadius: 5, width: 100 }}
                onChangeText={setNewWeight}
                value={setWeight}
                keyboardType="numeric"
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
                // sendRegisterChildRequest()
                //setModalVisible(false)
                console.log(birthDate)
                console.log('asdasdsa')
                console.log(weightDate)
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

export default ChildWeightModal
