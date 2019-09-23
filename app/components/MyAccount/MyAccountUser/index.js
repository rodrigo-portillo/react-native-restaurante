import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button, Image } from "react-native-elements";
import UserInfo from "../MyAccountUser/UserInfo";

export default class MyAccountUser extends Component {
  constructor(props) {
    //desde myaccount le pasa el objeto gotoscreen en props
    super(props);
  }
  render() {
    return (
      <View style={styles.userAcountView}>
        <UserInfo />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userAcountView: {
    height: "100%",
    backgroundColor: "#f2f2f2"
  }
});
