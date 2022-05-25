import * as React from "react";
import { useEffect } from "react";
import { NativeBaseProvider, Box, HStack, VStack, Text, Pressable, Image, ScrollView, Button } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import axios from "axios";
import { View, TextInput } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import ChangePassword from "./ChangePassword/ChangePassword";
import FamilyGroupSetting from "./FamilyGroupSetting/FamilyGroupSetting";

const Settings = ({ navigation }) => {
  return (
    <ScrollView style={{ margin: 0, marginTop: wp("5%"), backgroundColor: "#292524", height: wp("150%") }}>
      <ChangePassword />
      <FamilyGroupSetting />
    </ScrollView>
  );
};
export default Settings;

/*
<Pressable bg="#44403c" py="4" px="3" rounded="md" alignSelf="center" width={400} maxWidth="100%" style={{ width: wp("80%") }}>
        <View style={{ flexDirection: "row", alignItems: "stretch", justifyContent: "space-between", color: "white" }}>
          <Text>Save Settings</Text>
          <TextInput
          onChangeText={onChangeNumber}
        value={number} 
        placeholder="New Password"
        placeholderTextColor={"white"}
      />
      <TextInput
        onChangeText={onChangeNumber}
    value={number}
        placeholder="Re-New Password"
        placeholderTextColor={"white"}
      />
    </View>
    <Box alignItems="flex-end" style={{ marginTop: wp("1%") }}>
      <Button>
        <Text>Save Password</Text>
      </Button>
    </Box>
  </Pressable>

*/
