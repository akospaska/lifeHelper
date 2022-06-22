import React, { useEffect, useState } from 'react'

import { Box, Heading, Center, ScrollView, Flex, Select, CheckIcon } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const ChildChooser = (props) => {
  const { selectedKidId, setSelectedKidId, data, forModal } = props

  return (
    <Select
      selectedValue={selectedKidId}
      marginLeft={forModal ? 0 : wp('65%')}
      minWidth="50"
      width={100}
      accessibilityLabel="Choose Service"
      placeholder="Choose Service"
      _selectedItem={{
        bg: 'teal.600',
        endIcon: <CheckIcon size="5" />,
      }}
      mt={1}
      onValueChange={(itemValue) => setSelectedKidId(itemValue)}
    >
      <Select.Item label="Márk" value={1} />
      <Select.Item label="Panna" value={2} />
      <Select.Item label="Piroska" value={3} />
    </Select>
  )
}

export default ChildChooser
