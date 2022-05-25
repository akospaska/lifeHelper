import * as React from "react";
import { useEffect } from "react";
import { NativeBaseProvider, Box, HStack, VStack, Text, Pressable, Image, ScrollView } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import axios from "axios";
import { View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const ScheduledDays = () => {
  return (
    <Pressable bg="#44403c" py="4" px="3" rounded="md" alignSelf="center" width={400} maxWidth="100%" style={{ marginTop: 40, width: wp("80%") }}>
      <HStack justifyContent="space-between">
        <Box justifyContent="space-between">
          <VStack space="2">
            <Text color="white" fontSize="lg">
              Active Schedulded Days
            </Text>
          </VStack>
        </Box>
      </HStack>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <Text color="white" fontSize="lg">
          MO
        </Text>
        <Text color="white" fontSize="lg">
          TU
        </Text>
        <Text color="white" fontSize="lg">
          WE
        </Text>
        <Text color="white" fontSize="lg">
          TH
        </Text>
        <Text color="white" fontSize="lg">
          FR
        </Text>
      </View>
    </Pressable>
  );
};

export default ScheduledDays;
