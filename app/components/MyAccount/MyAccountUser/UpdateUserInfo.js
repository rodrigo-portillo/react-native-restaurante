import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ListItem, Overlay } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";
//import menuConfig from "./menuConfig";

import OverlayOneInput from "../../Elements/OverlayOneInput";
import OverlayTwoInput from "../../Elements/OverlayTwoInputs";
import OverlayThreeInput from "../../Elements/OverlayThreeInputs";

export default class UpdateUserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      overlayComponent: null,
      menuItems: [
        {
          title: "Cambiar Nombre y Apellidos",
          iconType: "material-community",
          iconNameLeft: "account-circle",
          iconColorLeft: "#ccc",
          iconNameRight: "chevron-right",
          iconColorRight: "#ccc",
          onPress: () =>
            this.openOverlay(
              "Nombre y Apellidos",
              this.updateUserDisplayName,
              props.userInfo.displayName
            )
        },
        {
          title: "Cambiar Email",
          iconType: "material-community",
          iconNameLeft: "at",
          iconColorLeft: "#ccc",
          iconNameRight: "chevron-right",
          iconColorRight: "#ccc",
          onPress: () =>
            this.openOverlayTwoInputs(
              "Email",
              "Password",
              props.userInfo.email,
              this.updateUserEmail
            )
        },
        {
          title: "Cambiar Contraseña",
          iconType: "material-community",
          iconNameLeft: "lock-reset",
          iconColorLeft: "#ccc",
          iconNameRight: "chevron-right",
          iconColorRight: "#ccc",
          onPress: () =>
            this.openOverlayThreeInputs(
              "Tu contraseña",
              "Nueva contraseña",
              "Repetir nueva contraseña",
              this.updateUserPassword
            )
        }
      ]
    };
    console.log("UpdateUserInfo: ", props);
  }

  updateUserDisplayName = async newDisplayName => {
    if (newDisplayName) {
      this.state.updateUserDisplayName(newDisplayName);
    }
    this.setState({
      overlayComponent: null
    });
  };

  openOverlay = (placeholder, updateFunction, inputValue) => {
    this.setState({
      overlayComponent: (
        <OverlayOneInput
          isVisibleOverlay={true}
          placeholder={placeholder}
          updateFunction={updateFunction}
          inputValue={inputValue}
        ></OverlayOneInput>
      )
    });
  };

  updateUserEmail = async (newEmail, password) => {
    const emailOld = this.props.userInfo.email;
    if (emailOld != newEmail && password) {
      this.state.updateUserEmail(newEmail, password);
    }
    this.setState({
      overlayComponent: null
    });
  };

  openOverlayTwoInputs = (
    placeholderOne,
    placeholderTwo,
    inputValueOne,
    updateFunction
  ) => {
    this.setState({
      overlayComponent: (
        <OverlayTwoInput
          isVisibleOverlay={true}
          placeholderOne={placeholderOne}
          placeholderTwo={placeholderTwo}
          inputValueOne={inputValueOne}
          inputValueTwo=""
          isPassword={true}
          updateFunction={updateFunction}
        ></OverlayTwoInput>
      )
    });
  };

  updateUserPassword = async (
    currentPassword,
    newPassword,
    repeatNewPassword
  ) => {
    if (currentPassword && newPassword && repeatNewPassword) {
      if (newPassword === repeatNewPassword) {
        if (currentPassword === newPassword) {
          this.refs.toast.show(
            "La nueva contraseña debe ser distinta al actual"
          );
        } else {
          this.state.updateUserPassword(currentPassword, newPassword);
        }
      } else {
        this.refs.toast.show("Las nuevas contraseñas deben ser iguales");
      }
    } else {
      this.refs.toast.show("Debe completar todos los campos");
    }
    this.setState({
      //TO-DO validations
      overlayComponent: null
    });
  };

  openOverlayThreeInputs = (
    placeholderOne,
    placeholderTwo,
    placeholderThree,
    updateFunction
  ) => {
    this.setState({
      overlayComponent: (
        <OverlayThreeInput
          isVisibleOverlay={true}
          placeholderOne={placeholderOne}
          placeholderTwo={placeholderTwo}
          placeholderThree={placeholderThree}
          inputValueOne=""
          inputValueTwo=""
          inputValueThree=""
          isPassword={true}
          updateFunction={updateFunction}
        />
      )
    });
  };

  render() {
    const { menuItems, overlayComponent } = this.state;
    return (
      <View>
        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            title={item.title}
            leftIcon={{
              type: item.iconType,
              name: item.iconNameLeft,
              color: item.iconColorLeft
            }}
            rightIcon={{
              type: item.iconType,
              name: item.iconNameRight,
              color: item.iconColorRight
            }}
            onPress={item.onPress}
            containerStyle={styles.contentContainerStyle}
          />
        ))}
        {overlayComponent}
        <Toast
          ref="toast"
          position="center"
          positionValue={0}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "#fff" }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  contentContainerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3"
  }
});
