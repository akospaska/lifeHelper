import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import React from 'react'
import { View } from 'native-base'

import CreateNewItem from './CreateNewItem/CreateNewItem'
import CreateNewCategory from './CreateNewCategory/CreateNewCategory'

export const Example = (props) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#292524',
        paddingBottom: 20,
      }}
    >
      <CreateNewItem
        fake={props.fake}
        forceRefresh={props.forceRefresh}
        selectedGroceryGroupId={props.selectedGroceryGroupId}
        setOpenedCategoryId={props.setOpenedCategoryId}
      />
      <CreateNewCategory forceRefresh={props.forceRefresh} selectedGroceryGroupId={props.selectedGroceryGroupId} />
    </View>
  )
}

export default (props) => {
  return (
    <Example
      fake={props.fake}
      forceRefresh={props.forceRefresh}
      selectedGroceryGroupId={props.selectedGroceryGroupId}
      setOpenedCategoryId={props.setOpenedCategoryId}
    />
  )
}
