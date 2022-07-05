import React, { useEffect, useState } from 'react'

import { Modal, Button, View } from 'native-base'

import DatePicker from 'react-native-modern-datepicker'

const DateTimePicker = (props) => {
  const { modalVisible, setModalVisible, selectedDate, setSelectedDate } = props

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
