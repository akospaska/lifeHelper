import React from 'react'
import { FormControl } from 'native-base'

import { TextInput, StyleSheet, Text } from 'react-native'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const CreateNewAccountModalInputField = ({ title, inputValue, setInputValue, errorMessage, type }) => {
  return (
    <FormControl>
      <FormControl.Label>
        <Text style={{ color: 'white' }}>{title}:</Text>
      </FormControl.Label>
      {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}:</Text> : console.log('')}
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        secureTextEntry={type == 'password'}
        style={styles.input}
        onChangeText={setInputValue}
        value={inputValue}
      />
    </FormControl>
  )
}

export default CreateNewAccountModalInputField

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
