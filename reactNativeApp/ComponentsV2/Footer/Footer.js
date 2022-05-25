import React from "react";
import { NativeBaseProvider, Box, Text, Heading, VStack, FormControl, Input, Link, Button, Icon, HStack, Center, Pressable } from "native-base";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const Footer = () => {
  const [selected, setSelected] = React.useState(1);
  return (
    <Box>
      <Center flex={1}></Center>
      <HStack bg="#44403c" alignItems="center" safeAreaBottom shadow={6}>
        <Pressable opacity={selected === 0 ? 1 : 0.5} py="3" flex={1} onPress={() => setSelected(0)}>
          <Center>
            <Icon mb="1" as={<MaterialCommunityIcons name={selected === 0 ? "home" : "home-outline"} />} color="white" size="sm" />
            <Text color="white" fontSize="12">
              Home
            </Text>
          </Center>
        </Pressable>
        <Pressable opacity={selected === 3 ? 1 : 0.5} py="2" flex={1} onPress={() => setSelected(3)}>
          <Center>
            <Icon mb="1" as={<MaterialCommunityIcons name={selected === 3 ? "account" : "account-outline"} />} color="white" size="sm" />
            <Text color="white" fontSize="12">
              Account
            </Text>
          </Center>
        </Pressable>
      </HStack>
    </Box>
  );
};

export default Footer;
