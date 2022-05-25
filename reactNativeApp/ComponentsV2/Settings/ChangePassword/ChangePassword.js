import * as React from "react";
import { useEffect } from "react";
import { NativeBaseProvider, Box, HStack, VStack, Text, Pressable, Image, ScrollView, Button } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import axios from "axios";
import { View, TextInput } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const ChangePassword = () => {
  return (
    <Pressable
      bg="#44403c"
      py="4"
      px="3"
      rounded="md"
      alignSelf="center"
      width={400}
      maxWidth="100%"
      style={{ marginTop: 40, width: wp("80%"), display: "flex", flexDirection: "row", justifyContent: "space-between" }}
    >
      <HStack justifyContent="space-between">
        <Box justifyContent="space-between">
          <VStack space="2">
            <Text color="white" fontSize="lg">
              Change Password
            </Text>
            <View style={{ display: "flex", alignItems: "flex-start" }}>
              <TextInput
                /*   onChangeText={onChangeNumber}
value={number}  */
                placeholder="New Password"
                placeholderTextColor={"white"}
              />
              <TextInput
                /*   onChangeText={onChangeNumber}
value={number} */
                placeholder="Re-New Password"
                placeholderTextColor={"white"}
              />
            </View>
          </VStack>
        </Box>
      </HStack>
      <Box alignItems="flex-start" style={{ marginTop: wp("1%") }}>
        <Button>
          <Text>Save Password</Text>
        </Button>
      </Box>
    </Pressable>
  );
};

export default ChangePassword;
