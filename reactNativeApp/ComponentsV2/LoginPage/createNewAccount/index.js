import React from 'react'
import { Button, Modal, FormControl, View } from 'native-base'
import { useState } from 'react'
import { Picker, TextInput, StyleSheet, Text } from 'react-native'
import axios from 'axios'
import { useEffect } from 'react'

import { apiendpoint } from '../../Api/ApiEndpoint/ApiEndpoint'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import CreateNewAccountModalInputField from './createNewAccountModalInputField/createNewAccountModalInputField'

const CreateNewAccountModal = () => {
  const [showModal, setShowModal] = useState(true)

  const [emailAddress, setEmailAddress] = useState('')
  const [emailErrorMessage, setEmailErrorMessage] = useState('')

  const [password, setPassword] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')

  const [passwordAgain, setPasswordAgain] = useState('')
  const [passwordAgainErrorMessage, setPasswordAgainErrorMEssage] = useState('')

  const [isErrorExists, setIsErrorExists] = useState(false)

  const [databaseErrorExist, setDatabaseErrorExist] = useState(false)

  const sendAccountCreateRequest = async () => {
    try {
      await apiendpoint.post('api/auth/register', {
        email: emailAddress,
        password: password,
        passwordAgain: passwordAgain,
        creatorAccountId: 0,
        isAdmin: false,
      })
    } catch (error) {
      if (error?.response?.status == 400) {
        error.response.data.error.map((a) => {
          switch (a.context.value) {
            case 'emailAddress':
              setEmailErrorMessage(a.context.message)
              break
            case 'password':
              setPasswordErrorMessage(a.context.message)
              break
            case 'passwordAgain':
              setPasswordErrorMessage(a.context.message)
              break
          }
        })
        return
      }
    }
  }

  const removeAllErrorMessage = () => {
    setEmailErrorMessage('')
    setPasswordErrorMessage('')
    setPasswordAgainErrorMEssage('')
  }

  const clearAllInputValue = () => {
    setEmailAddress('')
    setPassword('')
    setPasswordAgain('')
  }

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="400px" backgroundColor={'#292524'}>
        <Modal.CloseButton />
        <Modal.Header>
          <Text style={{ color: 'white' }}>Register new account</Text>
        </Modal.Header>
        <Modal.Body>
          <CreateNewAccountModalInputField
            title={'Email Address'}
            inputValue={emailAddress}
            setInputValue={setEmailAddress}
          ></CreateNewAccountModalInputField>

          <CreateNewAccountModalInputField
            title={'Password'}
            inputValue={password}
            setInputValue={setPassword}
          ></CreateNewAccountModalInputField>

          <CreateNewAccountModalInputField
            title={'Password again'}
            inputValue={passwordAgain}
            setInputValue={setPasswordAgain}
          ></CreateNewAccountModalInputField>
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
                backgroundColor:
                  emailAddress.length > 2 && password.length > 0 && passwordAgain.length > 0
                    ? 'rgb(252, 88, 76)'
                    : 'rgba(6,182,212,255)',
              }}
              disabled={emailAddress.length > 2 && password.length > 0 && passwordAgain.length > 0 ? false : true}
              onPress={() => {
                console.log(emailAddress)
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

export default CreateNewAccountModal

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    backgroundColor: '#fff',
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
    color: '#fff',
    borderRadius: 5,
  },
  createButton: { height: 40, borderWidth: 1, padding: 10, width: 300, fontSize: 20, alignContent: 'center' },
  headerText: { padding: 10, width: 300, fontSize: 30 },
})
