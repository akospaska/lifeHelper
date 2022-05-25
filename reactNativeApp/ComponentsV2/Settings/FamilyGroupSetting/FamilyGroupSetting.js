import * as React from "react";
import { useEffect } from "react";
import { NativeBaseProvider, Box, HStack, VStack, Text, Pressable, Image, ScrollView, Button } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import axios from "axios";
import { View, TextInput } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const FamilyGroupSetting = () => {
  return (
    <Pressable bg="#44403c" py="4" px="3" rounded="md" alignSelf="center" width={400} maxWidth="100%" style={{ marginTop: 40, width: wp("80%") }}>
      <HStack>
        <Box>
          <VStack space="2">
            <Text color="white" fontSize="lg">
              Family Group Settings
            </Text>
          </VStack>
        </Box>
      </HStack>
      <Box style={{ marginTop: wp("1%") }}>
        <Button>
          <Text>Create Family Group</Text>
        </Button>
      </Box>
      <Box style={{ marginTop: wp("1%") }}>
        <Button>
          <Text>Invite Family Group</Text>
        </Button>
      </Box>
      <Box style={{ marginTop: wp("1%") }}>
        <Button>
          <Text>Join Family Group</Text>
        </Button>
      </Box>
      <Box style={{ marginTop: wp("1%") }}>
        <Button>
          <Text>Leave Family Group</Text>
        </Button>
      </Box>
    </Pressable>
  );
};

export default FamilyGroupSetting;
