import React, { useEffect } from 'react'
import { View, Text, Modal, FormControl, Button, Input, HStack, Flex, Center, Pressable } from 'native-base'

import { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { StyleSheet, TextInput } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import DatePicker from 'react-native-modern-datepicker'
import { getDatePickerInitialDateFormat, timestampSecondsToFormattedDateTime } from '../../../../Utils/timeFormatter'

const BabyTrackerStatisitcListItemModal = (props) => {
  const { data } = props
  const [actStart, setActStart] = useState(0)
  const [actEnd, setActEnd] = useState(0)
  const [comm, setComm] = useState('')

  const [isStartDateCalendarOpen, setIsStartDateCalendarOpen] = useState(false)

  const [isEndsDateCalendarOpen, setIsEndsDateCalendarOpen] = useState(false)

  const { actionEnd, actionId, actionStart, comment, duration, endTime, id, startTime } = data

  useEffect(() => {
    setActStart(actionStart)
    setActEnd(actionEnd)
    setComm(comment)
  }, [])

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

  const { showModal, setShowModal } = props

  const [modalVisible, setModalVisible] = React.useState(false)
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)

  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        width={wp('100%')}
      >
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
                <Pressable onPress={() => setIsStartDateCalendarOpen(true)}>
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
                <Pressable onPress={() => setIsEndsDateCalendarOpen(true)}>
                  <AntDesign name="calendar" size={50} color="black" />
                </Pressable>
              </Flex>
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Comment:</FormControl.Label>
              <TextInput style={styles.input} onChangeText={comm} value={setComm} />
            </FormControl>

            {isStartDateCalendarOpen ? (
              <>
                <DatePicker
                  current={getDatePickerInitialDateFormat(actStart)}
                  onSelectedChange={(date) => {
                    console.log(date)

                    const y = new Date(date)
                    setActStart(y.getTime() / 1000)
                  }}
                />
                <Button
                  onPress={() => {
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
                <DatePicker
                  current={getDatePickerInitialDateFormat(actEnd)}
                  onSelectedChange={(date) => {
                    console.log(date)
                  }}
                />{' '}
                <Button
                  onPress={() => {
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
            <Flex flexDirection={'row'} justifyContent={'space-between'} width={wp('50%')}>
              <Button
                bg={'red.500'}
                onPress={() => {
                  setModalVisible(false)
                }}
              >
                Delete
              </Button>
              <Flex flexDirection={'row'}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setModalVisible(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => {
                    setModalVisible(false)
                  }}
                >
                  Save
                </Button>
              </Flex>
            </Flex>
          </Center>
        </Modal.Content>
      </Modal>
    </>
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
    fontSize: 20,
    marginBottom: 20,
    color: '#fff',
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
