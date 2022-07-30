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
  const { modalVisible, setModalVisible, refreshChildrenFn, childId } = props

  const [weight, setNewWeight] = useState(0)
  const [comment, setComment] = useState('')
  const [birthDate, setBirthDate] = useState('')

  const [weightDate, setWeightDate] = useState(Math.round(Date.now() / 1000))

  const sendRegisterChildRequest = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      await apiGateway.post('api/babytracker/childrenweight/insertnewweight', {
        childId: childId,
        weight: weight,
        comment: comment,
        date: weightDate,
      })

      refreshChildrenFn()
      setModalVisible(false)
    } catch (error) {
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

          <Modal.Header>Register Child Weight</Modal.Header>

          <Modal.Body>
            <DatePicker
              mode="calendar"
              current={getDatePickerInitialDateFormat(weightDate)}
              onSelectedChange={(date) => {
                const y = new Date(date)
                setWeightDate((y.getTime() + 7200000) / 1000)
              }}
            />
            <Flex flexDirection={'row'}>
              <FormControl mt="3">
                <FormControl.Label>Weight g</FormControl.Label>

                <TextInput
                  style={{ color: 'black', borderColor: 'grey', borderWidth: 1, height: 50, borderRadius: 5, width: 100 }}
                  onChangeText={setNewWeight}
                  value={weight}
                  keyboardType="numeric"
                />
              </FormControl>

              <FormControl mt="3" marginLeft={-150}>
                <FormControl.Label>Comment</FormControl.Label>

                <TextInput
                  style={{ color: 'black', borderColor: 'grey', borderWidth: 1, height: 50, borderRadius: 5, width: 150 }}
                  onChangeText={comment}
                  value={setComment}
                />
              </FormControl>
            </Flex>

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
