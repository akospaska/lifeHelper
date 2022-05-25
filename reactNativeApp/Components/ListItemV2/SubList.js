import * as React from "react";
import { View } from "native-base";

import { StyleSheet } from "react-native";
import SubListItem from "./SubListItem";

const SubList = (props) => {
  //const listItems = props.subList;

  const styles = StyleSheet.create({
    container: {
      display: props.hidden ? "none" : "flex",
    },
    listItem: {
      marginTop: 10,
    },
  });

  return (
    <View style={styles.container}>
      {props.subListItem.map((a, b) => (
        <SubListItem something={b} data={a} forceRefresh={props.forceRefresh} />
      ))}
    </View>
  );
};

export default SubList;
