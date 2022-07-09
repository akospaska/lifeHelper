import React, { useEffect, useState } from 'react'

import { Flex, Pressable, useToast, Modal, Button, Text, View } from 'native-base'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { getApiGatewayInstance } from '../../../Api/getApiGatewayInstance/getApiGatewayInstance'

import {
  displayErrorMessageByErrorStatusCode,
  revealFetchError,
} from '../../../Utils/GlobalErrorRevealer/GlobalErrorRevealer'
import { TextInput } from 'react-native'

const ParentshipManager = (props) => {
  const toast = useToast()

  const { modalVisible, setModalVisible, refreshChildrenFn } = props

  const [divorceVisibleCounter, setDivorceVisibleCounter] = useState(0)
  const [invitationAddress, setInvitationAddress] = useState('')

  const [refreshParentshipStatus, setRefresParentshipStatus] = useState(false)
  const [refreshPendingInvitations, setRefreshPendingInvitations] = useState(false)

  const [pendingInvitationStatuses, setPendingInvitationStatuses] = useState({})

  const [isInitialized, setIsInitialized] = useState(false)
  const [gotPartner, setGotPartner] = useState(false)

  const checkParentshipStatus = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      const response = await apiGateway.get('api/babytracker/parentship/checkstatus')

      setIsInitialized(true)
      setGotPartner(response.data.isValid)

      console.log(response.data)
    } catch (error) {
      console.log(error.response.data)
      try {
        displayErrorMessageByErrorStatusCode(toast, Number(error.response.status))
      } catch (error) {
        displayErrorMessageByErrorStatusCode(toast, 418)
      }
    }
  }

  const sendInvitation = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      await apiGateway.post('api/babytracker/parentship/invite', { email: invitationAddress })

      setRefreshPendingInvitations(!refreshPendingInvitations)
    } catch (error) {
      console.log(error.response.data)
      try {
        displayErrorMessageByErrorStatusCode(toast, Number(error.response.status))
      } catch (error) {
        displayErrorMessageByErrorStatusCode(toast, 418)
      }
    }
  }

  const declineInvitation = async (invitationId) => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      await apiGateway.post('api/babytracker/parentship/declineinvitation', { invitationId: invitationId })

      setRefreshPendingInvitations(!refreshPendingInvitations)
    } catch (error) {
      console.log(error.response.data)
      try {
        if (error.response.status == 403) {
          revealFetchError('Email not found!', 403, toast)
          return
        }
        displayErrorMessageByErrorStatusCode(toast, Number(error.response.status))
      } catch (error) {
        displayErrorMessageByErrorStatusCode(toast, 418)
      }
    }
  }

  const acceptInvitation = async (invitationId) => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      await apiGateway.post('api/babytracker/parentship/acceptinvitation', { invitationId: invitationId })

      // setRefreshPendingInvitations(!refreshPendingInvitations)
      setRefresParentshipStatus(!refreshParentshipStatus)
    } catch (error) {
      try {
        displayErrorMessageByErrorStatusCode(toast, Number(error.response.status))
      } catch (error) {
        displayErrorMessageByErrorStatusCode(toast, 418)
      }
    }
  }

  const divorce = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      await apiGateway.get('api/babytracker/parentship/divorce')

      // setRefreshPendingInvitations(!refreshPendingInvitations)
      setRefresParentshipStatus(!refreshParentshipStatus)
    } catch (error) {
      try {
        displayErrorMessageByErrorStatusCode(toast, Number(error.response.status))
      } catch (error) {
        displayErrorMessageByErrorStatusCode(toast, 418)
      }
    }
  }

  const checkPendingInvitations = async () => {
    console.log('I am checking the invitations')
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      const apiResponse = await apiGateway.get('api/babytracker/parentship/checkparentinvitations')

      setPendingInvitationStatuses(apiResponse.data)

      //  setRefreshPendingInvitations(!refreshPendingInvitations)
    } catch (error) {
      try {
        displayErrorMessageByErrorStatusCode(toast, Number(error.response.status))
      } catch (error) {
        displayErrorMessageByErrorStatusCode(toast, 418)
      }
    }
  }

  useEffect(() => {
    checkPendingInvitations()
  }, [refreshPendingInvitations])

  useEffect(() => {
    checkParentshipStatus()
    checkPendingInvitations()
  }, [refreshParentshipStatus])

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
          <Modal.CloseButton />
          <Pressable onPress={() => setDivorceVisibleCounter(divorceVisibleCounter + 1)}>
            <Modal.Header>Parentship Manager</Modal.Header>
          </Pressable>
          {isInitialized ? (
            <Modal.Body>
              {gotPartner ? (
                <>
                  <Text>You've got a partner already</Text>
                </>
              ) : (
                <>
                  <View>
                    <Text>Invite Partner</Text>
                    <Flex flexDirection={'row'}>
                      <TextInput
                        style={{
                          color: 'black',
                          borderColor: 'grey',
                          borderWidth: 1,
                          height: 50,
                          borderRadius: 5,
                          width: wp('50%'),
                        }}
                        onChangeText={setInvitationAddress}
                        value={invitationAddress}
                      />
                      <Button
                        flex="1"
                        onPress={() => {
                          // updateChild()
                          // setInvitationAddress('')
                          sendInvitation()
                        }}
                      >
                        Send
                      </Button>
                    </Flex>
                  </View>

                  {pendingInvitationStatuses === {} ? (
                    <Text>No any Pending invitations</Text>
                  ) : (
                    <React.Fragment>
                      <Text>Check pending invitations:</Text>
                      <Text>Received:</Text>
                      {pendingInvitationStatuses?.invitationsReceived.map((a) => {
                        return (
                          <ReceivedInvitationListItem
                            from={a.inviterEmailAddress}
                            invitationId={a.id}
                            acceptInvitation={acceptInvitation}
                            declineInvitation={declineInvitation}
                          />
                        )
                      })}
                      <Text>Sent:</Text>
                      {pendingInvitationStatuses?.invited.map((a) => {
                        return (
                          <SentInvitationListItem
                            to={a.invitedEmailAddress}
                            invitationId={a.id}
                            acceptInvitation={acceptInvitation}
                            declineInvitation={declineInvitation}
                          />
                        )
                      })}
                    </React.Fragment>
                  )}
                </>
              )}
              <Button
                marginTop={hp('1%')}
                width={wp('25%')}
                onPress={() => {
                  setRefresParentshipStatus(!refreshParentshipStatus)
                }}
                key={'xs'}
                size={'xs'}
                marginRight={wp('1%')}
                _pressed={{
                  opacity: 0.9,
                }}
              >
                Refresh
              </Button>

              {gotPartner && divorceVisibleCounter > 6 ? (
                <Button
                  bg="red.500"
                  marginTop={hp('1%')}
                  width={wp('25%')}
                  onPress={() => {
                    divorce()
                  }}
                  key={'xs'}
                  size={'xs'}
                  marginRight={wp('1%')}
                  _pressed={{
                    bg: 'red.500',
                    opacity: 0.9,
                  }}
                >
                  Divorce
                </Button>
              ) : (
                console.log('')
              )}
            </Modal.Body>
          ) : (
            console.log('')
          )}
        </Modal.Content>
      </Modal>
    </>
  )
}

export default ParentshipManager

const ReceivedInvitationListItem = (props) => {
  const { from, invitationId, acceptInvitation, declineInvitation } = props
  const [stat, setStat] = useState(0)
  return (
    <View>
      <Flex flexDirection={'row'} justifyContent="space-between">
        <Text>From:{from}</Text>
        <Flex flexDirection={'row'}>
          <Button
            onPress={() => {
              declineInvitation(invitationId)
            }}
            bg="red.500"
            key={'xs'}
            size={'xs'}
            marginRight={wp('1%')}
            _pressed={{
              bg: 'red.500',
              opacity: 0.9,
            }}
          >
            Decline
          </Button>
          <Button
            bg="green.500"
            key={'xs'}
            size={'xs'}
            _pressed={{
              bg: 'green.500',
              opacity: 0.9,
            }}
            onPress={() => {
              acceptInvitation(invitationId)
            }}
          >
            Accept
          </Button>
        </Flex>
      </Flex>
    </View>
  )
}

const SentInvitationListItem = (props) => {
  const { to, invitationId, acceptInvitation, declineInvitation } = props
  const [stat, setStat] = useState(0)
  return (
    <View>
      <Flex flexDirection={'row'} justifyContent="space-between">
        <Text>From:{to}</Text>
        <Flex flexDirection={'row'}>
          <Button
            bg="red.500"
            key={'xs'}
            size={'xs'}
            marginRight={wp('1%')}
            _pressed={{
              bg: 'red.500',
              opacity: 0.9,
            }}
            onPress={() => {
              declineInvitation(invitationId)
            }}
          >
            Delete
          </Button>
        </Flex>
      </Flex>
    </View>
  )
}
