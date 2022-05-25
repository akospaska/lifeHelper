import * as React from "react";
import { useEffect } from "react";
import { NativeBaseProvider, Box, HStack, VStack, Text, Pressable, Image, ScrollView } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { View } from "react-native";

import { useSelector } from "react-redux";

import GroceryListItem from "./GroceryListItem/GroceryListItem";
import Footer from "../Footer/Footer";
import MenuContainer from "../../Components/MenuContainter/MenuContainer";
import { Picker } from "react-native";

import { getApiGatewayInstance } from "../Api/getApiGatewayInstance/getApiGatewayInstance";

const GroceryList = ({ navigation }) => {
  const [priority, setPriority] = useState(1);
  const [fake, setFake] = useState(false);
  const [groceryList, setGroceryList] = useState([]);

  const [groceryGroups, setGroceryGroups] = useState([]);
  const [selectedGroceryGroupId, setSelectedGroceryGroupId] = useState(0);

  const forceRefresh = () => {
    setFake(!fake);
  };

  const getGroceryGroups = async () => {
    const token = await AsyncStorage.getItem("@token");
    const apiGateway = getApiGatewayInstance(token);

    const response = await apiGateway.get("api/grocery/group/getgroups");

    try {
      setGroceryGroups(response.data);
      setSelectedGroceryGroupId(response.data[0].id);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const getCategoriesWithItems = async () => {
    const token = await AsyncStorage.getItem("@token");
    const apiGateway = getApiGatewayInstance(token);

    const response = await apiGateway.post("api/grocery/category/getcategorieswithitems", { groupId: selectedGroceryGroupId });

    try {
      setGroceryList(response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    getGroceryGroups();
  }, [fake]);

  useEffect(() => {
    getCategoriesWithItems();
  }, [selectedGroceryGroupId, fake]);

  return (
    <React.Fragment>
      <ScrollView style={{ margin: 0, marginTop: wp("5%"), backgroundColor: "#292524", height: wp("100%") }}>
        <Picker
          selectedValue={selectedGroceryGroupId}
          style={{
            height: 50,
            width: 250,
            color: "white",
            position: "absolute",
            left: wp("30%"),
            top: wp("2%"),
          }}
          onValueChange={(itemValue, itemIndex) => setSelectedGroceryGroupId(itemValue)}
        >
          {groceryGroups.map((a) => {
            return <Picker.Item label={a.groceryGroupName} value={a.id} />;
          })}
        </Picker>

        {groceryList.map((a, b) => {
          if (a.groceryItemList.length > 0) {
            return (
              <View key={a.id} style={{ marginTop: b === 0 ? 20 : 0 }}>
                <GroceryListItem data={a} fake={fake} setFake={setFake} />
              </View>
            );
          }
        })}
      </ScrollView>
      {selectedGroceryGroupId != 0 ? (
        <MenuContainer fake={false} setFake={setFake} forceRefresh={forceRefresh} selectedGroceryGroupId={selectedGroceryGroupId} />
      ) : (
        console.log()
      )}
    </React.Fragment>
  );
};
export default GroceryList;
