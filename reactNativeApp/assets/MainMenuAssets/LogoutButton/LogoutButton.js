import * as React from "react";

import { NativeBaseProvider, Box, HStack, VStack, Text, Pressable, Image, ScrollView } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import GraphQlConfig from "../../../ComponentsV2/Api/GraphQLConfig/GraphQLConfig";

import { useDispatch } from "react-redux";
import { setLoginStatus } from "../../../actions";

import axios from "axios";

const LogoutButton = ({ navigation }) => {
  const dispatch = useDispatch();

  const logout = () => {
    const query = `mutation{P1logout}`;
    axios(GraphQlConfig(query))
      .then(function (response) {
        dispatch(setLoginStatus(false));
      })
      .catch(function (error) {
        dispatch(setLoginStatus(false));
      });
  };
  return (
    <Pressable
      bg="#44403c"
      py="4"
      px="3"
      rounded="md"
      alignSelf="center"
      width={400}
      maxWidth="100%"
      onTouchEnd={(e) => navigation.navigate("Settings") /* logout() */}
      style={{ marginTop: 40, width: wp("80%"), display: "flex", flexDirection: "row", justifyContent: "space-between" }}
    >
      <HStack justifyContent="space-between">
        <Box justifyContent="space-between">
          <VStack space="2">
            <Text color="white" fontSize="lg">
              {"Logout"}
            </Text>
          </VStack>
        </Box>
      </HStack>
      <View>
        <FontAwesome5 name={"exclamation"} size={40} color="white" />
      </View>
    </Pressable>
  );
};

export default LogoutButton;
