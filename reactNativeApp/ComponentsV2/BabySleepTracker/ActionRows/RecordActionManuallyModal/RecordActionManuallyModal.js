import React, { useEffect } from 'react'

import { View, Text, Modal, FormControl, Button, Input, Select, Flex, Center, Pressable, useToast, CheckIcon } from 'native-base'

import { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { StyleSheet, TextInput } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import DatePicker from 'react-native-modern-datepicker'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { getDatePickerInitialDateFormat, timestampSecondsToFormattedDateTime } from '../../../Utils/timeFormatter'

import { getApiGatewayInstance } from '../../../Api/getApiGatewayInstance/getApiGatewayInstance'
import { displayErrorMessageByErrorStatusCode } from '../../../Utils/GlobalErrorRevealer/GlobalErrorRevealer'

const RecordActionManuallyModal = (props) => {
  const toast = useToast()

  const { actualNewActionId, setActualNewActionId, selectedKidId } = props

  const [actStart, setActStart] = useState(0)
  const [actEnd, setActEnd] = useState(0)
  const [comm, setComm] = useState('')

  const [actEndHours, setActEndHours] = useState(0)
  const [actStartHours, setActStartHours] = useState(0)

  const [actStartMinutes, setActStartMinutes] = useState(0)
  const [actEndMinutes, setActEndMinutes] = useState(0)

  const [isStartDateCalendarOpen, setIsStartDateCalendarOpen] = useState(false)

  const [isEndsDateCalendarOpen, setIsEndsDateCalendarOpen] = useState(false)

  const { showModal, setShowModal, setSelectedAction } = props

  const saveActionManually = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    console.log({
      actionId: actualNewActionId,
      actionStart: actStart,
      actionEnd: actEnd,
      comment: comm,
      childId: selectedKidId,
    })
    try {
      const axiosResponse = await apiGateway.post('api/babytracker/actions/recordactions/manually', {
        actionId: actualNewActionId,
        actionStart: actStart,
        actionEnd: actEnd,
        comment: comm,
        childId: selectedKidId,
      })

      const responseData = axiosResponse.data
      console.log(responseData)
      setShowModal(false)
    } catch (error) {
      console.log(error.response)
      try {
        displayErrorMessageByErrorStatusCode(toast, Number(error.response.status))
      } catch (error) {
        displayErrorMessageByErrorStatusCode(toast, 418)
      }
    }
  }

  return (
    <>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} width={wp('100%')} height={700}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Save action manually</Modal.Header>
          <Modal.Body>
            <Select
              selectedValue={actualNewActionId}
              minWidth="200"
              accessibilityLabel="Choose an action"
              placeholder="Choose an action"
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={(itemValue) => setActualNewActionId(itemValue)}
            >
              <Select.Item label="Sleep" value={1} />
              <Select.Item label="Brest Feed" value={2} />
              <Select.Item label="Walk" value={3} />
              <Select.Item label="Falling asleep" value={4} />
              <Select.Item label="Eat" value={5} />
            </Select>
            <FormControl mt="3">
              <Flex flexDirection={'row'} justifyContent={'space-between'}>
                <View>
                  <FormControl.Label>Start Time:</FormControl.Label>
                  <Text>{timestampSecondsToFormattedDateTime(actStart)}</Text>
                </View>
                <Pressable
                  onPress={() => {
                    setIsEndsDateCalendarOpen(false)
                    setIsStartDateCalendarOpen(true)
                  }}
                >
                  <AntDesign name="calendar" size={50} color="black" />
                </Pressable>
              </Flex>
            </FormControl>

            <FormControl mt="3">
              <Flex flexDirection={'row'} justifyContent={'space-between'}>
                <View>
                  <FormControl.Label>End Time:</FormControl.Label>
                  <Text>{timestampSecondsToFormattedDateTime(actEnd)}</Text>
                </View>
                <Pressable
                  onPress={() => {
                    setIsStartDateCalendarOpen(false)
                    setIsEndsDateCalendarOpen(true)
                  }}
                >
                  <AntDesign name="calendar" size={50} color="black" />
                </Pressable>
              </Flex>
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Comment:</FormControl.Label>
              <TextInput style={styles.input} onChangeText={setComm} value={comm} />
            </FormControl>

            {isStartDateCalendarOpen ? (
              <>
                <Flex flexDirection={'row'} justifyContent={'space-evenly'} marginBottom={2}>
                  <Input
                    placeholder="hour"
                    width={100}
                    keyboardType="number-pad"
                    onChangeText={(num) => {
                      const hour = Number(num)
                      if (hour > 23 || hour < 0) {
                        console.log('I am return')

                        return
                      }

                      setActStartHours(hour)
                    }}
                    value={actStartHours}
                  ></Input>
                  <Input
                    placeholder="minutes"
                    width={100}
                    keyboardType="number-pad"
                    onChangeText={(num) => {
                      const minutes = Number(num)
                      if (minutes > 59 || minutes < 0) {
                        console.log('I am return')
                        return
                      }

                      setActStartMinutes(minutes)
                    }}
                  ></Input>
                </Flex>
                <DatePicker
                  mode={'calendar'}
                  onSelectedChange={(date) => {
                    const y = new Date(date)
                    setActStart((y.getTime() + 7200000) / 1000)
                  }}
                />
                <Button
                  onPress={() => {
                    const hoursInMs = actStartHours * 3600
                    const minutesInMs = actStartMinutes * 60
                    const sum = hoursInMs + minutesInMs

                    setActStart(actStart + sum)

                    setIsStartDateCalendarOpen(false)
                  }}
                >
                  Save Date
                </Button>
              </>
            ) : (
              ''
            )}
            {isEndsDateCalendarOpen ? (
              <>
                <Flex flexDirection={'row'} justifyContent={'space-evenly'} marginBottom={2}>
                  <Input
                    placeholder="hour"
                    width={100}
                    keyboardType="number-pad"
                    onChangeText={(num) => {
                      const hour = Number(num)
                      if (hour > 23 || hour < 0) {
                        console.log('I am return')

                        return
                      }

                      setActEndHours(hour)
                    }}
                    value={actEndHours}
                  ></Input>
                  <Input
                    placeholder="minutes"
                    width={100}
                    keyboardType="number-pad"
                    onChangeText={(num) => {
                      const minutes = Number(num)
                      if (minutes > 59 || minutes < 0) {
                        console.log('I am return')
                        return
                      }

                      setActEndMinutes(minutes)
                    }}
                  ></Input>
                </Flex>
                <DatePicker
                  mode={'calendar'}
                  onSelectedChange={(date) => {
                    const y = new Date(date)
                    setActEnd((y.getTime() + 7200000) / 1000)
                  }}
                />
                <Button
                  onPress={() => {
                    const hoursInMs = actEndHours * 3600
                    const minutesInMs = actEndMinutes * 60
                    const sum = hoursInMs + minutesInMs

                    setActEnd(actEnd + sum)

                    setIsEndsDateCalendarOpen(false)
                  }}
                >
                  Save Date
                </Button>
              </>
            ) : (
              ''
            )}
          </Modal.Body>

          <Center marginBottom={hp('2%')}>
            <Flex flexDirection={'row'}>
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
                onPress={() => {
                  saveActionManually()

                  //
                  // setModalVisible(false)
                }}
              >
                Save
              </Button>
            </Flex>
          </Center>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default RecordActionManuallyModal

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#828282',
    padding: 10,
    width: wp('65%'),
    fontSize: 18,
    marginBottom: 20,
    color: 'grey',
    borderRadius: 5,
  },
  input2: {
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
