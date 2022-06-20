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
  HamburgerIcon,
  FormControl,
  Input,
  Modal,
  Button,
  Text,
  VStack,
  HStack,
  Switch,
  View,
} from 'native-base'

import DatePicker from 'react-native-modern-datepicker'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const DateTimePicker = (props) => {
  const [selectedDate, setSelectedDate] = useState('')

  const { modalVisible, setModalVisible } = props

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
        <Modal.Content>
          <View marginBottom={10}>
            <Modal.CloseButton />
          </View>
          <DatePicker onSelectedChange={(date) => setSelectedDate(date)} />
          <Modal.Body></Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                setModalVisible(false)
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

export default DateTimePicker
