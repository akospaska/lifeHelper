import * as React from "react";
import { useEffect } from "react";
import { NativeBaseProvider, Box, HStack, VStack, Text, Pressable, Image, ScrollView, Button } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import axios from "axios";
import { View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import ScheduledDays from "./ScheduledDays/ScheduledDays";
import SetSchedule from "./SetSchedule/SetSchedule";

const TravelManager = ({ navigation }) => {
  return (
    <ScrollView style={{ margin: 0, marginTop: wp("5%"), backgroundColor: "#292524", height: wp("150%") }}>
      <ScheduledDays />
      <SetSchedule origin={"Start"} />
      <SetSchedule origin={"End"} />
      <Box alignItems="center" style={{ marginTop: wp("10%") }}>
        <Button>
          <Text>Save Settings</Text>
        </Button>
      </Box>
    </ScrollView>
  );
};
export default TravelManager;
