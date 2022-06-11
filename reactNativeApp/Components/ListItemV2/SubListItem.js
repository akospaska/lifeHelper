import * as React from "react";
import { Text, View, Divider, Button } from "native-base";

import { StyleSheet } from "react-native";
import axios from "axios";

const SubListItem = (props) => {

  const styles = StyleSheet.create({
    listItem: {
      marginTop: 10,
    },
    btn: { width: 100, height: 35, alignItems: "flex-end", flexDirection: "row" },
  });

  const deleteItem = () => {
    var data = JSON.stringify({
      itemId: props.data.id,
      secretKey: "macilaci",
    });

    var config = {
      method: "post",
      url: "https://referenceprojects-abkno.run-eu-central1.goorm.io/reactnative/deleteitem",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        props.forceRefresh();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <View key={props.data.id} style={styles.listItem}>
      <Divider my="2" style={{ marginTop: 20 }} />
      <Text color="white" fontSize={20}>
        {props.data.name}
      </Text>
      <Button style={{ position: "absolute", right: 0, backgroundColor: "#059669", top: 30 }} onPress={() => deleteItem()}>
        Done
      </Button>
    </View>
  );
};

export default SubListItem;
