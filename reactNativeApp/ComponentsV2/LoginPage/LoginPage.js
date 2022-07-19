import * as React from 'react'
import { useState } from 'react'
import { Box, Text, Heading, VStack, FormControl, Link, Button, HStack, Center, View, Pressable } from 'native-base'
import { TextInput } from 'react-native'
import { useDispatch } from 'react-redux'

import { setLoginStatus, setActualToken } from '../../actions'

import { apiendpoint } from '../Api/ApiEndpoint/ApiEndpoint'

import AsyncStorage from '@react-native-async-storage/async-storage'
import CreateNewAccountModal from './createNewAccount'
import LoadingSpinner from '../../assets/LoadingSpinner/LoadingSpinner'

const LoginPage = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')

  const [mainErrorMessage, setMainErrorMessage] = useState('')

  const [createAccountModalActive, setCreateAccountModalActive] = useState(false)

  const { isLoading, setIsLoading } = props

  const dispatch = useDispatch()

  const login = async () => {
    setIsLoading(true)

    try {
      const response = await apiendpoint.post('api/auth/login', { email: email, password: password })
      setIsLoading(false)

      if (response.data.code == 200) {
        await AsyncStorage.setItem('@isLoggedIn', 'true')
        await AsyncStorage.setItem('@token', response.data.hashValue)
        dispatch(setActualToken(response.data.hashValue))
        dispatch(setLoginStatus(true))
      }
    } catch (error) {
      try {
        console.log('asdasd')
        setIsLoading(false)
        console.log(error.response)
        console.log({ email: email, password: password })
        setPasswordErrorMessage('')
        setEmailErrorMessage('')

        if (error?.response?.status == 400) {
          error.response.data.error.map((a) => {
            if (a.context.key === 'email') {
              setEmailErrorMessage(a.message)
            }

            if (a.context.key === 'password') {
              setPasswordErrorMessage(a.message)
            }
          })

          return
        }

        if (error.response.status == 401) {
          setMainErrorMessage(error.response.data.errorMessage)
          return
        }
        if (error.response.status == 403) {
          setMainErrorMessage(error.response.data.errorMessage)
          return
        }
        if (error.response.status == 418) {
          setMainErrorMessage(error.response.data.errorMessage)
          return
        }
        if (error.response.status == 500) {
          setMainErrorMessage('Server Error!')
          return
        }

        setMainErrorMessage('Server Error!')
        return
      } catch (error) {
        setMainErrorMessage('Check your internet connection!')
      }
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#292524', justifyContent: 'center', alignItems: 'center' }}>
      <Center w="100%" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading
            size="lg"
            fontWeight="600"
            color="white"
            _dark={{
              color: '#ffff',
            }}
          >
            Welcome
          </Heading>
          <Heading
            mt="1"
            _dark={{
              color: 'white',
            }}
            color="white"
            fontWeight="medium"
            size="xs"
          >
            Sign in to continue!
          </Heading>

          {mainErrorMessage === '' ? console.log('') : <Text style={{ color: 'red' }}>{mainErrorMessage}</Text>}

          <VStack space={3} mt="5">
            <FormControl color="white">
              <Text style={{ color: 'white' }}>Email Address</Text>
              {emailErrorMessage === '' ? console.log('') : <Text style={{ color: 'red' }}>{emailErrorMessage}</Text>}

              <Pressable onFocus={() => console.log('')}>
                <TextInput
                  style={{ color: 'white', borderColor: 'white', borderWidth: 1, height: 50, borderRadius: 5 }}
                  onChangeText={setEmail}
                  value={email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </Pressable>
            </FormControl>

            <FormControl>
              <Text style={{ color: 'white' }}>Password</Text>

              {passwordErrorMessage === '' ? (
                console.log('')
              ) : (
                <Text style={{ color: 'red' }}>{passwordErrorMessage}</Text>
              )}

              <TextInput
                type="password"
                secureTextEntry={true}
                style={{ color: 'white', borderColor: 'white', borderWidth: 1, height: 50, borderRadius: 5 }}
                onChangeText={setPassword}
                value={password}
              />
              <Link
                _text={{
                  fontSize: 'xs',
                  fontWeight: '500',
                  color: 'white',
                }}
                alignSelf="flex-end"
                mt="1"
              >
                Forget Password?
              </Link>
            </FormControl>
            <Button mt="2" colorScheme="indigo" onTouchEnd={(e) => login()}>
              Sign in
            </Button>
            <HStack mt="6" justifyContent="center" flexDirection={'row'}>
              <Text
                p="0"
                fontSize="sm"
                color="white"
                _dark={{
                  color: 'warmGray.200',
                }}
              >
                I'm a new user.
              </Text>
              <Button colorScheme="indigo" ml="10" onTouchEnd={(e) => setCreateAccountModalActive(true)}>
                Sign up
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Center>
      <CreateNewAccountModal
        showModal={createAccountModalActive}
        setShowModal={setCreateAccountModalActive}
      ></CreateNewAccountModal>
      {isLoading ? <LoadingSpinner /> : console.log()}
    </View>
  )
}

export default LoginPage
