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
} from 'native-base'
import ChildChooser from '../../ChildChooser/ChildChooser'

import { Icon } from 'react-native-elements'

import DateTimePicker from '../../../Utils/DateTimePicker/DateTimePicker'

const ChildrenManager = (props) => {
  const [selectedKidId, setSelectedKidId] = useState(1)
  const { modalVisible, setModalVisible } = props

  const [actualChildName, setActualChildName] = useState('')
  const [isActualChildDefault, setIsActualChildDefault] = useState(false)

  const [showDateTimePicker, setShowDateTimePicker] = useState(false)
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
          <Modal.Header>Children Manager</Modal.Header>
          <Modal.Body>
            <Flex flexDirection={'row'} justifyContent={'space-between'}>
              <ChildChooser selectedKidId={selectedKidId} setSelectedKidId={setSelectedKidId} forModal={true} />
            </Flex>
            <FormControl mt="3">
              <FormControl.Label>Name</FormControl.Label>
              <Input />
            </FormControl>
            <Flex flexDirection={'row'} justifyContent={'space-between'}>
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
            </Flex>
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

export default ChildrenManager