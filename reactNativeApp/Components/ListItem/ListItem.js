import * as React from "react";
import { Box, HStack, VStack, Text, Pressable } from "native-base";
import { View } from "native-base";
import { Ionicons } from "@expo/vector-icons";

import { useState } from "react";
import SubListITemContainer from "./SubListItemContainer/SubListITemContainer";

const ListItem = () => {
  const [listHidden, setListHidden] = useState(true);

  return (
    <View>
      <Box bg="primary.600" py="4" px="3" rounded="md" alignSelf="center" width={600} maxWidth="100%" marginBottom={5}>
        <HStack justifyContent="space-between">
          <Box justifyContent="space-between">
            <VStack space="2">
              <Text fontSize="sm" color="white">
                Cooking
              </Text>
              <Text color="white" fontSize="lg">
                Löncshús
              </Text>
            </VStack>
            <Pressable
              rounded="sm"
              bg="primary.400"
              alignSelf="flex-start"
              py="4"
              px="3"
              onPress={() => {
                setListHidden(!listHidden);
              }}
            >
              <Text textTransform="uppercase" fontSize="sm" fontWeight="bold" color="white">
                Got it
              </Text>
            </Pressable>
          </Box>
          <Ionicons name="analytics-outline" size={90} color="white" />
        </HStack>
      </Box>
      <View style={{ display: listHidden ? "none" : "flex" }}>
        <SubListITemContainer />
      </View>
    </View>
  );
};

export default ListItem;
