import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

import ActionButton from "react-native-action-button";

export default class Restaurant extends Component {
  goToScreen = nameScreen => {
    this.props.navigation.navigate(nameScreen);
  };

  render() {
    return (
      <View style={styles.viewBody}>
        <Text>Restaurant Screen...</Text>
        <ActionButton
          buttonColor="#00a680"
          onPress={() => {
            this.goToScreen("AddRestaurant");
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
