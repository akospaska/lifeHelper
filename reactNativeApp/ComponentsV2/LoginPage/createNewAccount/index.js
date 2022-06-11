import React from 'react'
import { Button, Modal } from 'native-base'
import { useState } from 'react'
import { Text, View } from 'react-native'

import { useEffect } from 'react'

import { apiendpoint } from '../../Api/ApiEndpoint/ApiEndpoint'

import CreateNewAccountModalInputField from './createNewAccountModalInputField/createNewAccountModalInputField'

const CreateNewAccountModal = ({ showModal, setShowModal }) => {
  const [emailAddress, setEmailAddress] = useState('')
  const [emailErrorMessage, setEmailErrorMessage] = useState('')

  const [password, setPassword] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')

  const [passwordAgain, setPasswordAgain] = useState('')
  const [passwordAgainErrorMessage, setPasswordAgainErrorMEssage] = useState('')

  const [isErrorExists, setIsErrorExists] = useState(false)

  const [mutualErrorMessage, setMutualErrorMEssage] = useState('')

  const [registerRequestArrived, setRegisterRequestArrived] = useState(false)

  const sendAccountCreateRequest = async () => {
    try {
      const axiosResponse = await apiendpoint.post('api/auth/register', {
        emailAddress: emailAddress,
        password: password,
        passwordAgain: passwordAgain,
        creatorAccountId: 0,
        isAdmin: false,
      })
      console.log(axiosResponse.data.isValid)
      if (!axiosResponse.data.isValid) {
        throw new Error('Database error')
      }
      setRegisterRequestArrived(true)
      return
    } catch (error) {
      setIsErrorExists(true)

      if (error.response.status == 400) {
        error.response.data.error.map((a) => {
          console.log(a.label)
          switch (a.context.label) {
            case 'emailAddress':
              setEmailErrorMessage(a.message)
              break
            case 'password':
              console.log(a.context.message)
              setPasswordErrorMessage(a.message)
              break
            case 'passwordAgain':
              console.log(a.context.message)
              setPasswordAgainErrorMEssage(a.message)
              break
          }
        })
        return
      }
      if (error.response.status == 403) {
        setMutualErrorMEssage(error.response.data.errorMessage)

        return
      }
      setMutualErrorMEssage('DATABASE ERROR!')
    }
  }

  const removeAllErrorMessage = () => {
    setMutualErrorMEssage('d')
    setEmailErrorMessage('')
    setPasswordErrorMessage('')
    setPasswordAgainErrorMEssage('')
  }

  const clearAllInputValue = () => {
    setEmailAddress('')
    setPassword('')
    setPasswordAgain('')
  }

  useEffect(() => {
    if (isErrorExists) {
      removeAllErrorMessage()
      clearAllInputValue()
      setIsErrorExists(false)
    }
  }, [emailAddress, password, passwordAgain])

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="400px" backgroundColor={'#292524'}>
        <Modal.CloseButton />
        <Modal.Header>
          <Text style={{ color: 'white' }}>Register new account</Text>
          {mutualErrorMessage ? <Text style={{ color: 'red' }}>{mutualErrorMessage}</Text> : console.log('')}
        </Modal.Header>
        {registerRequestArrived ? (
          <View>
            <Modal.Body>
              <Text style={{ color: 'white' }}>Register Request has been sent!</Text>
              <Text style={{ color: 'white' }}>Please check your mailbox</Text>
            </Modal.Body>

            <Modal.Footer style={{ backgroundColor: '#292524' }}>
              <Button.Group space={2}>
                <Button
                  style={{ backgroundColor: 'rgba(6,182,212,255)' }}
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setShowModal(false)
                    setRegisterRequestArrived(false)
                  }}
                >
                  Ok
                </Button>
              </Button.Group>
            </Modal.Footer>
          </View>
        ) : (
          <View>
            <Modal.Body>
              <CreateNewAccountModalInputField
                title={'Email Address'}
                inputValue={emailAddress}
                setInputValue={setEmailAddress}
                errorMessage={emailErrorMessage}
                type={'email'}
              ></CreateNewAccountModalInputField>

              <CreateNewAccountModalInputField
                title={'Password'}
                inputValue={password}
                setInputValue={setPassword}
                errorMessage={passwordErrorMessage}
                type={'password'}
              ></CreateNewAccountModalInputField>

              <CreateNewAccountModalInputField
                title={'Password again'}
                inputValue={passwordAgain}
                setInputValue={setPasswordAgain}
                errorMessage={passwordAgainErrorMessage}
                type={'password'}
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
                        ? 'rgba(6,182,212,255)'
                        : 'rgb(252, 88, 76)',
                  }}
                  disabled={emailAddress.length > 2 && password.length > 0 && passwordAgain.length > 0 ? false : true}
                  onPress={() => {
                    sendAccountCreateRequest()
                  }}
                >
                  Register Account
                </Button>
              </Button.Group>
            </Modal.Footer>
          </View>
        )}
      </Modal.Content>
    </Modal>
  )
}

export default CreateNewAccountModal
