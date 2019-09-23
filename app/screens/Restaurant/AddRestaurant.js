import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Image, Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Toast, { DURATION } from "react-native-easy-toast";
import { uploadImage } from "../../utils/UploadImage";

import t from "tcomb-form-native";
const Form = t.form.Form;
import {
  AddRestaurantStruct,
  AddRestaurantOption
} from "../../forms/AddRestaurant";

import { firebaseApp } from "../../../app/utils/FireBase";
import fireBase from "firebase/app";
import "firebase/firestore";
const db = fireBase.firestore(firebaseApp);

export default class AddRestaurant extends Component {
  constructor() {
    super();

    this.state = {
      imageUriRestaurant: "",
      formData: {
        name: "",
        city: "",
        address: "",
        description: ""
      }
    };
  }

  isImageRestaurante = image => {
    if (image) {
      return (
        <Image source={{ uri: image }} style={{ width: 500, height: 180 }} />
      );
    } else {
      return (
        <Image
          source={require("../../../assets/img/no-image.png")}
          style={{ width: 200, height: 180 }}
        />
      );
    }
  };

  uploadImage = async () => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    if (resultPermissions.status === "denied") {
      this.refs.toast.show(
        "Es necesario aceptar los permisos de la galeria",
        1000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true
      });

      if (result.cancelled) {
        this.refs.toast.show("Has cerrado la galeria de imagenes", 1000);
      } else {
        this.setState({
          imageUriRestaurant: result.uri
        });
      }
    }
  };

  onChangeFormAddRestaurant = formValue => {
    this.setState({
      formData: formValue
    });

    console.log("State: ", this.state);
  };

  addRestaurant = () => {
    const { imageUriRestaurant } = this.state;
    const { name, city, address, description } = this.state.formData;

    if (imageUriRestaurant && name && city && address && description) {
      const data = {
        name,
        city,
        address,
        description,
        image: ""
      };

      db.collection("restaurants")
        .add({ data })
        .then(resolve => {
          console.log("Restaurante añadido");
        })
        .catch(err => {
          this.refs.toast.show("Error de servidor, intentelo más tarde", 1000);
        });
    } else {
      this.refs.toast.show("Debes rellenar todos los campos", 1000);
    }
  };

  render() {
    const { imageUriRestaurant } = this.state;

    return (
      <View style={styles.viewBody}>
        <View style={styles.viewPhoto}>
          {this.isImageRestaurante(imageUriRestaurant)}
        </View>
        <View>
          <Form
            ref="AddRestaurantForm"
            type={AddRestaurantStruct}
            options={AddRestaurantOption}
            value={this.state.formData}
            onChange={formValue => this.onChangeFormAddRestaurant(formValue)}
          />
        </View>
        <View style={styles.viewIconUploadPhoto}>
          <Icon
            name="camera"
            type="material-community"
            color="#7A7A7A"
            iconStyle={styles.addPhotoIcon}
            onPress={() => this.uploadImage()}
          />
        </View>
        <View style={styles.viewButtonAddRestaurant}>
          <Button
            title="Crear Restaurante"
            onPress={() => this.addRestaurant()}
            buttonStyle={styles.buttonAddRestaurant}
          />
        </View>
        <Toast
          ref="toast"
          position="bottom"
          positionValue={320}
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
  viewBody: {
    flex: 1
  },
  viewPhoto: {
    alignItems: "center",
    height: 180,
    marginBottom: 20
  },
  viewIconUploadPhoto: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: 12
  },
  addPhotoIcon: {
    backgroundColor: "#e3e3e3",
    padding: 17,
    paddingBottom: 14,
    margin: 0
  },
  viewButtonAddRestaurant: {
    flex: 1,
    justifyContent: "flex-end"
  },
  buttonAddRestaurant: {
    backgroundColor: "#00a680",
    margin: 20
  }
});
