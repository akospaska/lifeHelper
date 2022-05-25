/* import React from "react";
import { VStack, Center, Heading, NativeBaseProvider, Text, ScrollView } from "native-base";

import { StyleSheet } from "react-native";

export function Example() {
  const arr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  return (
    <VStack space={4} alignItems="center">
      <Heading textAlign="center" mb="10">
        Categories
      </Heading>
      <ScrollView>
        {arr.map((a, b) => {
          return (
            <Center w="450" h="100" bg="#5e5d56" rounded="md" shadow={3} style={styles.container}>
              <Text style={{ color: "#fff" }}>Category Item</Text>
            </Center>
          );
        })}
      </ScrollView>
    </VStack>
  );
}

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <Example />
      </Center>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", marginBottom: 10, textAlign: "left" },
});
 */

import * as React from "react";
import { useEffect } from "react";
import { NativeBaseProvider, Box, HStack, VStack, Text, Pressable, Image, ScrollView } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import ListItemV2Item from "./ListItemV2Item";
import { useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import axios from "axios";
import { View } from "react-native";

export default function UtilityFirstExample(props) {
  const [data, setData] = useState([]);

  const getData = () => {
    props.setRefreshing(true);

    var data = JSON.stringify({
      query: `{groceryCategories{id,name,icon,itemList{id,name}}}`,
      secretKey: "macilaci",
    });

    var config = {
      method: "post",
      url: "https://referenceprojects-abkno.run-eu-central1.goorm.io/graphql",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setData(response.data.data.groceryCategories);

        props.setRefreshing(false);
      })
      .catch(function (error) {
        props.setRefreshing(false);
        alert("Server Disconnected!!!");
      });
  };

  useEffect(() => {
    getData();
  }, [props.fake]);

  const arr = [1, 1, 1];
  return (
    <NativeBaseProvider>
      <ScrollView style={{ marginTop: wp("5%") }}>
        {data.map((a, b) => {
          if (a.itemList.length > 0) {
            return (
              <View key={a.id}>
                <ListItemV2Item fake={props.fake} something={b} data={a} forceRefresh={props.forceRefresh} />
              </View>
            );
          }
        })}
      </ScrollView>
    </NativeBaseProvider>
  );
}
