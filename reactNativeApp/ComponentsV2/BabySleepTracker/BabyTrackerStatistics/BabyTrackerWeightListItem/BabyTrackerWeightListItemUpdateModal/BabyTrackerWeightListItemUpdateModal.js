import { Modal, Text, ScrollView, Button, View, Flex } from 'native-base'
import { useEffect, useState } from 'react'
import { TextInput } from 'react-native'
import DatePicker from 'react-native-modern-datepicker'
import { StyleSheet } from 'react-native'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { getDatePickerInitialDateFormat } from '../../../../Utils/timeFormatter'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { getApiGatewayInstance } from '../../../../Api/getApiGatewayInstance/getApiGatewayInstance'
import { displayErrorMessageByErrorStatusCode } from '../../../../Utils/GlobalErrorRevealer/GlobalErrorRevealer'

const BabyTrackerWeightListItemUpdateModal = (props) => {
  const { modalVisible, setModalVisible, data, refreshStatistics, childId } = props
  const { weight, date, comment, id } = data

  const [weightInGramm, setWeight] = useState(data.weight)
  const [weightDate, setWeightDate] = useState(data.date)
  const [comm, setComment] = useState(data.comment)

  const updateWeight = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      const axiosResponse = await apiGateway.post('api/babytracker/childrenweight/updateweight', {
        weightId: id,
        weight: weightInGramm,
        childId: childId,
        comment: comm,
        date: weightDate,
      })

      const updateResult = axiosResponse.data
      refreshStatistics()
      setModalVisible(false)
    } catch (error) {
      try {
        displayErrorMessageByErrorStatusCode(toast, Number(error.response.status))
      } catch (error) {
        displayErrorMessageByErrorStatusCode(toast, 418)
      }
    }
  }

  const deleteWeight = async () => {
    const token = await AsyncStorage.getItem('@token')
    const apiGateway = getApiGatewayInstance(token)

    try {
      const axiosResponse = await apiGateway.post('api/babytracker/childrenweight/deleteweight', {
        weightId: id,
      })

      const updateResult = axiosResponse.data
      refreshStatistics()
      setModalVisible(false)
    } catch (error) {
      try {
        displayErrorMessageByErrorStatusCode(toast, Number(error.response.status))
      } catch (error) {
        displayErrorMessageByErrorStatusCode(toast, 418)
      }
    }
  }

  useEffect(() => {
    setWeight(`${weight}`)
    setWeightDate(date)
    setComment(comment)
  }, [])

  return (
    <Modal isOpen={modalVisible} onClose={setModalVisible}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Weight Manager</Modal.Header>
        <Modal.Body>
          <DatePicker
            mode="calendar"
            current={getDatePickerInitialDateFormat(date)}
            onSelectedChange={(date) => {
              const y = new Date(date)
              setWeightDate((y.getTime() + 7200000) / 1000)
            }}
          />
          <Flex flexDirection={'row'}>
            <View marginRight={30}>
              <Text>Weight g</Text>
              <TextInput
                style={{ color: 'black', borderColor: 'grey', borderWidth: 1, height: 50, borderRadius: 5, width: 100 }}
                onChangeText={setWeight}
                value={weightInGramm}
                keyboardType="numeric"
              />
            </View>
            <View>
              <Text>Comment</Text>
              <TextInput style={styles.input} onChangeText={setComment} value={comm} />
            </View>
          </Flex>
        </Modal.Body>
        <Modal.Footer>
          <Flex flexDirection={'row'} justifyContent="space-between">
            <Button
              colorScheme="red"
              onPress={async () => {
                await deleteWeight()
              }}
            >
              Delete
            </Button>
            <View>
              <Button.Group space={2}>
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
                  onPress={async () => {
                    await updateWeight()
                  }}
                >
                  Save
                </Button>
              </Button.Group>
            </View>
          </Flex>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
export default BabyTrackerWeightListItemUpdateModal

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#828282',
    padding: 10,
    width: wp('35%'),
    fontSize: 18,
    marginBottom: 20,
    color: 'grey',
    borderRadius: 5,
  },
  input2: {
    height: 40,
    borderWidth: 1,
    borderColor: '#828282',
    padding: 10,
    width: wp('45%'),
    fontSize: 20,
    marginBottom: 20,
    color: '#fff',
    borderRadius: 5,
  },
  createButton: { height: 40, borderWidth: 1, padding: 10, width: 300, fontSize: 20, alignContent: 'center' },
  headerText: { padding: 10, width: 300, fontSize: 30 },
})
