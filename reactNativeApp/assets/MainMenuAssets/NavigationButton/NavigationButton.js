import * as React from "react";

import { Box, HStack, VStack, Text, Pressable } from "native-base";

import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const NavigationButton = ({ navigation, details, key }) => {
  const { icon, name, navigationEndpoint } = details;

  return (
    <Pressable
      bg="#44403c"
      py="4"
      px="3"
      rounded="md"
      alignSelf="center"
      width={400}
      maxWidth="100%"
      onTouchEnd={(e) => {
        navigation.navigate(navigationEndpoint);
      }}
      style={{ marginTop: 40, width: wp("80%"), display: "flex", flexDirection: "row", justifyContent: "space-between" }}
      key={key}
    >
      <HStack justifyContent="space-between">
        <Box justifyContent="space-between">
          <VStack space="2">
            <Text color="white" fontSize="lg">
              {name}
            </Text>
          </VStack>
        </Box>
      </HStack>
      <View>
        <FontAwesome5 name={icon} size={40} color="white" />
      </View>
    </Pressable>
  );
};

export default NavigationButton;
