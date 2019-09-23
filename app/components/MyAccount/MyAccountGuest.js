import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Button, Image } from "react-native-elements";

export default class MyAccount extends Component {
  constructor(props) {
    //desde myaccount le pasa el objeto gotoscreen en props
    super(props);
  }
  render() {
    const { goToScreen } = this.props;
    return (
      <View style={(style = styles.viewBody)}>
        <Image
          source={require("../../../assets/img/image-my-account-guest-01.jpg")}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator />} //muestra un spinner al momento de cargar la imagen
          resizeMode="contain"
        />
        <Text style={styles.title}>Consulta tu perfil de 5 Tenedores</Text>
        <Text style={styles.descripcion}>
          ¿Cómo describirias tu mejor restaurante? Busca y visualiza los mejores
          restaurantes de una forma sencilla, vota cual te ha gustado más y
          comenta como ha sido tu experiencia.
        </Text>
        <Button
          title="Ver tu perfil"
          buttonStyle={styles.btnViewProfile}
          onPress={() => goToScreen("Login")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30
  },
  image: {
    height: 300,
    marginBottom: 40
  },
  title: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 10
  },
  descripcion: {
    textAlign: "center",
    marginBottom: 20
  },
  btnViewProfile: {
    backgroundColor: "#00a680",
    justifyContent: "center",
    alignItems: "center"
  }
});
