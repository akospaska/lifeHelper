import React from 'react'

import { Menu, Pressable, HamburgerIcon, View } from 'native-base'

const BabyTrackerMenu = (props) => {
  const { setShowChildrenManager, setShowRegisterChildModal } = props

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
      <Menu.Item
        onPress={() => {
          setShowRegisterChildModal(true)
        }}
      >
        Register new Child
      </Menu.Item>
      <Menu.Item
        onPress={() => {
          setShowChildrenManager(true)
        }}
      >
        Children Manager
      </Menu.Item>
      <Menu.Item
        onPress={() => {
          setShowChildrenManager(true)
        }}
      >
        Parentship manager
      </Menu.Item>
    </Menu>
  )
}

export default BabyTrackerMenu
