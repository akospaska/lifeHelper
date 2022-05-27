import * as React from 'react'

import { NativeBaseProvider, ScrollView } from 'native-base'

import ListItemV2Item from './ListItemV2Item'
import { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { View } from 'react-native'

export default function UtilityFirstExample(props) {
  const [data, setData] = useState([])

  return (
    <NativeBaseProvider>
      <ScrollView style={{ marginTop: wp('5%') }}>
        {data.map((a, b) => {
          if (a.itemList.length > 0) {
            return (
              <View key={a.id}>
                <ListItemV2Item fake={props.fake} something={b} data={a} forceRefresh={props.forceRefresh} />
              </View>
            )
          }
        })}
      </ScrollView>
    </NativeBaseProvider>
  )
}
