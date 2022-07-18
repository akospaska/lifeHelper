import React, { useEffect } from 'react'
import { View, Text, Modal, FormControl, Button, Input, HStack, Flex, Center, Pressable, useToast } from 'native-base'

import { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { StyleSheet, TextInput } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import DatePicker from 'react-native-modern-datepicker'
import {
  getDatePickerInitialDateFormat,
  getDifferentFromTimestamp,
  timestampSecondsToFormattedDateTime,
} from '../../../../Utils/timeFormatter'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getApiGatewayInstance } from '../../../../Api/getApiGatewayInstance/getApiGatewayInstance'
import { displayErrorMessageByErrorStatusCode } from '../../../../Utils/GlobalErrorRevealer/GlobalErrorRevealer'

const BabyTrackerStatisitcListItemModal = (props) => {
  const toast = useToast()
  const { data, refreshStatistics } = props
  const [actStartHours, setActStartHours] = useState(0)
  const [actStartMinutes, setActStartMinutes] = useState(0)
  const [actStart, setActStart] = useState(0)
  const [actEnd, setActEnd] = useState(0)
  const [actEndHours, setActEndHours] = useState(0)
  const [actEndtMinutes, setActEndMinutes] = useState(0)
  const [comm, setComm] = useState('')

  const [isStartDateCalendarOpen, setIsStartDateCalendarOpen] = useState(false)

  const [isEndsDateCalendarOpen, setIsEndsDateCalendarOpen] = useState(false)

  const { actionEnd, actionId, actionStart, comment, duration, endTime, id, startTime } = data

  useEffect(() => {
    setActStart(actionStart)
    setActEnd(actionEnd)

    if (!comment) {
      setComm('')
      return
    }

    setComm(comment)
  }, [])

  useEffect(() => {
    console.log('Comment has been changed')
  }, [comm])

  const updateAction = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    console.log({
      actionId: id,
      startTime: actStart,
      endTime: actEnd,
      comment: comm,
    })

    try {
      const axiosResponse = await apiGateway.post('api/babytracker/actions/updateaction', {
        actionId: id,
        startTime: actStart,
        endTime: actEnd,
        comment: comm,
      })

      const responseData = axiosResponse.data
      console.log(responseData)
      setShowModal(false)
      setSelectedAction({})
      refreshStatistics()
    } catch (error) {
      console.log(error.response)
      try {
        displayErrorMessageByErrorStatusCode(toast, Number(error.response.status))
      } catch (error) {
        displayErrorMessageByErrorStatusCode(toast, 418)
      }
    }
  }

  const deleteAction = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      const axiosResponse = await apiGateway.post('api/babytracker/actions/deleteaction', { actionId: id })

      const responseData = axiosResponse.data
      console.log(responseData)

      setSelectedAction({})
      setShowModal(false)
      refreshStatistics()
    } catch (error) {
      console.log(error.response)
      try {
        displayErrorMessageByErrorStatusCode(toast, Number(error.response.status))
      } catch (error) {
        displayErrorMessageByErrorStatusCode(toast, 418)
      }
    }
  }

  const fakeData = {
    actionEnd: 1656772308,
    actionId: 5,
    actionStart: 1656772305,
    childId: 3,
    comment: null,
    creationDate: '2022-07-02T12:31:44.000Z',
    duration: '00:03',
    endTime: '14:31:48',
    id: 70,
    startTime: '14:31:45',
  }

  useEffect(() => {
    console.log('I am changed')
  }, [actStartHours])

  const { showModal, setShowModal, setSelectedAction } = props

  const [modalVisible, setModalVisible] = React.useState(false)

  return (
    <View>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Action Manager</Modal.Header>
          <Modal.Body>
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
              <Flex flexDirection={'row'}>
                <Text>Since last time: {getDifferentFromTimestamp(actEnd)} </Text>
              </Flex>
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Comment:</FormControl.Label>
              <TextInput style={styles.input} onChangeText={setComm} value={comm} />
            </FormControl>

            {isStartDateCalendarOpen ? (
              <View>
                <Flex flexDirection={'row'} justifyContent={'space-evenly'} marginBottom={2}>
                  <Input
                    placeholder="hour"
                    width={100}
                    keyboardType="number-pad"
                    onChangeText={(num) => {
                      const hour = Number(num)
                      if (hour > 23 || hour < 0) {
                        console.log('I am return')
                        setActStartHours(0)
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
                        setActStartMinutes(0)
                        return
                      }

                      setActStartMinutes(minutes)
                    }}
                  ></Input>
                </Flex>

                <DatePicker
                  mode="calendar"
                  current={getDatePickerInitialDateFormat(actStart)}
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
              </View>
            ) : (
              ''
            )}
            {isEndsDateCalendarOpen ? (
              <View>
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
                  style={{ borderRadius: 10, borderColor: 'red', borderWidh: 20, marginBottom: 50 }}
                  current={getDatePickerInitialDateFormat(actEnd)}
                  onSelectedChange={(date) => {
                    console.log('I should be changed')
                    const y = new Date(date)
                    setActEnd((y.getTime() + 7200000) / 1000)
                  }}
                />
                <Button
                  onPress={() => {
                    const hoursInMs = actEndHours * 3600
                    const minutesInMs = actEndtMinutes * 60
                    const sum = hoursInMs + minutesInMs

                    setActEnd(actEnd + sum)

                    setIsEndsDateCalendarOpen(false)
                  }}
                >
                  Save Date
                </Button>
              </View>
            ) : (
              ''
            )}
          </Modal.Body>

          <Center marginBottom={hp('2%')}>
            <Flex flexDirection={'row'} justifyContent={'space-between'} width={wp('50%')}>
              <Button
                bg={'red.500'}
                onPress={() => {
                  deleteAction()
                }}
              >
                Delete
              </Button>
              <Flex flexDirection={'row'}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setShowModal(false)
                    setSelectedAction({})
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => {
                    console.log('update action pressed')
                    console.log(comm)
                    updateAction()
                    //
                    // setModalVisible(false)
                  }}
                >
                  Save
                </Button>
              </Flex>
            </Flex>
          </Center>
        </Modal.Content>
      </Modal>
    </View>
  )
}

export default BabyTrackerStatisitcListItemModal

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
