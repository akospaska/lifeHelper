import * as React from "react";
import { Text, View, Divider, Button } from "native-base";

import { getApiGatewayInstance } from "../../../Api/getApiGatewayInstance/getApiGatewayInstance";

import { useSelector } from "react-redux";

import { StyleSheet } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const styles = StyleSheet.create({
  listItem: {
    marginTop: 10,
  },
  btn: { width: 100, height: 35, alignItems: "flex-end", flexDirection: "row" },
});

const GroceySubListItem = (props) => {
  const { id, name } = props.data;

  const removeListItem = async (itemId) => {
    const token = await AsyncStorage.getItem("@token");
    const apiGateway = getApiGatewayInstance(token);

    await apiGateway.post("api/grocery/groceryitem/deletegroceryitem", { groceryItemId: itemId });

    try {
      props.setFake(!props.fake);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View key={id} style={styles.listItem}>
      <Divider my="2" style={{ marginTop: 20 }} />
      <Text color="white" fontSize={20}>
        {name}
      </Text>
      <Button style={{ position: "absolute", right: 0, backgroundColor: "#059669", top: 30 }} onPress={() => removeListItem(props.data.id)}>
        Done
      </Button>
    </View>
  );
};
export default GroceySubListItem;
