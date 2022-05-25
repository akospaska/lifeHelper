import * as React from "react";
import { useEffect } from "react";
import { NativeBaseProvider, Box, HStack, VStack, Text, Pressable, Image, ScrollView, Spinner } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import axios from "axios";
import { View, Picker, TextInput } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import LoadingSpinner from "../../../assets/LoadingSpinner/LoadingSpinner";
let hours = [];

for (let i = 0; i < 24; i++) {
  hours.push(i);
}
const minutes = [0, 15, 30, 45];

const SetAddress = (props) => {
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const { origin } = props;
  return (
    <Pressable bg="#44403c" py="4" px="3" rounded="md" alignSelf="center" width={400} maxWidth="100%" style={{ width: wp("80%") }}>
      <View style={{ flexDirection: "row", alignItems: "stretch", justifyContent: "space-between", color: "white" }}>
        <TextInput
          /*   onChangeText={onChangeNumber}
        value={number} */
          placeholder="ZipCode"
          placeholderTextColor={"white"}
        />
        <TextInput
          /*   onChangeText={onChangeNumber}
        value={number} */
          placeholder="City"
          placeholderTextColor={"white"}
        />
        <TextInput
          /*   onChangeText={onChangeNumber}
        value={number} */
          placeholder="Address"
          placeholderTextColor={"white"}
        />
      </View>
    </Pressable>
  );
};
export default SetAddress;
