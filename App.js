import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { firebaseApp } from "./app/utils/FireBase";

import UserNavigation from "./app/navigations/User";

export default function App() {
  return (
    <View style={styles.container}>
      <UserNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
