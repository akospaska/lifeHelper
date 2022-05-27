import * as React from 'react'

import { ScrollView } from 'native-base'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import LogoutButton from '../../assets/MainMenuAssets/LogoutButton/LogoutButton'
import NavigationButton from '../../assets/MainMenuAssets/NavigationButton/NavigationButton'

const menuData = [
  { name: 'Grocery List', icon: 'shopping-basket', navigationEndpoint: 'GroceryList' },
  { name: 'Home Finance', icon: 'dollar-sign', navigationEndpoint: 'GroceryList' },
  { name: 'Travel Manager', icon: 'car', navigationEndpoint: 'TravelManager' },
  { name: 'Settings', icon: 'cog', navigationEndpoint: 'Settings' },
]
const MainMenu = ({ navigation }) => {
  return (
    <ScrollView style={{ margin: 0, marginTop: wp('5%'), backgroundColor: '#292524', height: wp('150%') }}>
      {menuData.map((a, b) => {
        return <NavigationButton navigation={navigation} details={a} key={b} />
      })}
      <LogoutButton navigation={navigation} details={menuData[0]} />
    </ScrollView>
  )
}
export default MainMenu
