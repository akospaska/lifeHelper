import React from 'react'

import { Menu, Pressable, HamburgerIcon, View } from 'native-base'

const BabyTrackerMenu = (props) => {
  const { setShowChildrenManager } = props
  return (
    <Menu
      w="190"
      trigger={(triggerProps) => {
        return (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <HamburgerIcon height={50} />
          </Pressable>
        )
      }}
    >
      <Menu.Item onPress={() => console.log('menu pressed')}>Register new Child</Menu.Item>
      <Menu.Item
        onPress={() => {
          setShowChildrenManager(true)
        }}
      >
        Children Manager
      </Menu.Item>
    </Menu>
  )
}

export default BabyTrackerMenu
