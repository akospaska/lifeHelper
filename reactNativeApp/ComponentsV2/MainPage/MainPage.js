import * as React from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import GroceryList from "../GroceryList/GroceryList";
import LoginPage from "../LoginPage/LoginPage";
import MainMenu from "../MainMenu/MainMenu";
import TravelManager from "../TravelManager/TravelManager";
import Settings from "../Settings/Settings";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { setLoginStatus } from "../../actions";
import { useDispatch } from "react-redux";

import LoadingSpinner from "../../assets/LoadingSpinner/LoadingSpinner";
import Footer from "../Footer/Footer";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { getApiGatewayInstance } from "../Api/getApiGatewayInstance/getApiGatewayInstance";

const Stack = createNativeStackNavigator();

const MainPage = () => {
  const dispatch = useDispatch();

  const loginStatus = useSelector((state) => state.loginStatus);

  const checkSession = async () => {
    const token = await AsyncStorage.getItem("@token");

    const apiGateway = getApiGatewayInstance(token);

    const response = await apiGateway.get("api/auth/me");

    try {
      if (response.status === 200 && response.data.accountId > 0) {
        dispatch(setLoginStatus(true));
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  if (!loginStatus) return <LoginPage />;
  else {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainMenu" component={MainMenu} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="GroceryList" component={GroceryList} />
          <Stack.Screen name="TravelManager" component={TravelManager} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};
export default MainPage;
