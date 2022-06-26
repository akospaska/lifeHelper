import React, { useEffect, useState } from 'react'

import { Box, Heading, Center, ScrollView, Flex, Select, CheckIcon } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const ChildChooser = (props) => {
  const { selectedKidId, setSelectedKidId, data, forModal, children } = props

  return (
    <Select
      selectedValue={selectedKidId}
      minWidth="50"
      width={100}
      accessibilityLabel="Register a Child"
      placeholder="Register a Child"
      _selectedItem={{
        bg: 'teal.600',
        endIcon: <CheckIcon size="5" />,
      }}
      mt={1}
      onValueChange={(itemValue) => setSelectedKidId(itemValue)}
    >
      {children.map((child) => (
        <Select.Item label={child.name} value={child?.id ? child.id : 1} />
      ))}
    </Select>
  )
}

export default ChildChooser
