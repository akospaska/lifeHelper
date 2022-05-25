import * as React from "react";
import { useEffect } from "react";
import { NativeBaseProvider, Box, HStack, VStack, Text, Pressable, Image, ScrollView, Button } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import axios from "axios";
import { View, Picker } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import SetAddress from "../SetAddress/SetAddress";

let hours = [];

for (let i = 0; i < 24; i++) {
  hours.push(i);
}
const minutes = [0, 15, 30, 45];

const SetSchedule = (props) => {
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const { origin } = props;

  return (
    <Pressable
      bg="#44403c"
      py="4"
      px="3"
      rounded="md"
      alignSelf="center"
      width={400}
      maxWidth="100%"
      style={{ marginTop: 40, width: wp("80%") }}
    >
      <HStack justifyContent="space-between">
        <Box justifyContent="space-between">
          <VStack space="2">
            <Text color="white" fontSize="lg">
              {origin}
            </Text>
          </VStack>
        </Box>
      </HStack>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", color: "white" }}>
        <Picker
          selectedValue={selectedHour}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue, itemIndex) => setSelectedHour(itemValue)}
        >
          {hours.map((a, b) => {
            return <Picker.Item label={`${a}`} value={a} key={b} color="#a8a8a8" />;
          })}
        </Picker>
        <Picker
          selectedValue={selectedMinute}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue, itemIndex) => setSelectedMinute(itemValue)}
        >
          {minutes.map((a, b) => {
            return <Picker.Item label={`${a}`} value={a} key={b} color="#a8a8a8" />;
          })}
        </Picker>
      </View>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", color: "white" }}>
        <SetAddress origin={"something"} />
      </View>
    </Pressable>
  );
};

export default SetSchedule;
