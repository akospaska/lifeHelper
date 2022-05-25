import * as React from "react";

import { NativeBaseProvider, extendTheme } from "native-base";
import { StyleSheet } from "react-native";
import { createStore } from "redux";
import { Provider } from "react-redux";
import allReducers from "./reducers";
import { RefreshControl, SafeAreaView, ScrollView, Text } from "react-native";

import MainPage from "./ComponentsV2/MainPage/MainPage";

export default function App() {
  const myStore = createStore(allReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

  return (
    <Provider store={myStore}>
      <SafeAreaView style={styles.container}>
        <NativeBaseProvider>
          <MainPage />
        </NativeBaseProvider>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292524",
  },
  scrollView: {
    flex: 1,
  },
});