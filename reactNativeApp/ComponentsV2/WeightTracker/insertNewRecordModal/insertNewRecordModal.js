import React from 'react'
import { Button, Modal, FormControl, View } from 'native-base'
import { useState } from 'react'
import { Picker, TextInput, StyleSheet, Text } from 'react-native'
import axios from 'axios'
import { useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useSelector } from 'react-redux'

import { getApiGatewayInstance } from '../../../ComponentsV2/Api/getApiGatewayInstance/getApiGatewayInstance'

const InsertNewRecordModal = (props) => {
  const [newWeight, setNewWeight] = useState(0)
  const { showModal, setShowModal } = props

  const saveNewWeight = (weight) => {
    const newWeight = parseInt(weight)

    if (!newWeight) {
      console.log('Its not a number')
      return
    }

    console.log(newWeight)
  }

  useEffect(() => {
    console.log(newWeight)
  }, [newWeight])

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="400px" backgroundColor={'#292524'}>
        <Modal.CloseButton />

        <Modal.Body>
          <FormControl>
            <FormControl.Label>
              <Text style={{ color: 'white' }}>New Weight:</Text>
            </FormControl.Label>
            <TextInput keyboardType="numeric" style={styles.input} onChangeText={setNewWeight} value={newWeight} />
          </FormControl>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#292524' }}>
          <Button.Group space={2}>
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
              style={{
                backgroundColor: newWeight < 0 ? 'rgb(252, 88, 76)asd' : 'rgba(6,182,212,255)',
              }}
              onPress={() => {
                saveNewWeight(newWeight)
              }}
            >
              Save
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

export default InsertNewRecordModal

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#828282',
    padding: 10,
    width: wp('65%'),
    fontSize: 20,
    marginBottom: 20,
    color: 'white',
    borderRadius: 5,
  },
  createButton: { height: 40, borderWidth: 1, padding: 10, width: 300, fontSize: 20, alignContent: 'center' },
  headerText: { padding: 10, width: 300, fontSize: 30 },
})
