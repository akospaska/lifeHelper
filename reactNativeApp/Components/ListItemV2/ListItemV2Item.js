import * as React from "react";
import { Box, HStack, VStack, Text, Pressable } from "native-base";
import { Ionicons } from "@expo/vector-icons";

import { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { View } from "react-native";

import { useEffect } from "react";
import SubListItem from "./SubListItem";
const ListItemV2Item = (props) => {
  const [subListState, setSubListState] = useState([]);

  useEffect(() => {
    setSubListState(props.data.itemList);
  }, [props.fake]);
  const [hidden, setHidden] = useState(true);
  return (
    <Box
      key={props.id}
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
              {props.data.name}
            </Text>
          </VStack>
          <Pressable rounded="sm" bg="#78716c" alignSelf="flex-start" py="4" px="3" onPress={() => setHidden(!hidden)}>
            <Text textTransform="uppercase" fontSize="sm" fontWeight="bold" color="white">
              Show Items!
            </Text>
          </Pressable>
        </Box>
        {props.data.icon == "fast-food" ? (
          <Ionicons name={props.data.icon} size={90} color="white" />
        ) : (
          <FontAwesome5 name={props.data.icon} size={90} color="white" />
        )}
      </HStack>
      {props.data.itemList.map((a, b) => {
        return (
          <View key={a.id} style={{ display: hidden ? "none" : "flex" }}>
            <SubListItem data={a} forceRefresh={props.forceRefresh} />
          </View>
        );
      })}
    </Box>
  );
};

export default ListItemV2Item;
