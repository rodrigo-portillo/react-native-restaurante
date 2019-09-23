import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Image, Button, Divider, SocialIcon } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";

import t from "tcomb-form-native";
const Form = t.form.Form;

import { LoginStruct, LoginOptions } from "../../forms/Login";

import * as firebase from "firebase";
import * as Facebook from "expo-facebook";
import { FacebookApi } from "../../utils/Social";

export default class Login extends Component {
  constructor() {
    super();

    this.state = {
      LoginStruct: LoginStruct,
      LoginOptions: LoginOptions,
      loginData: {
        email: "",
        password: ""
      },
      LoginErrorMessage: ""
    };
  }

  Login = () => {
    const validate = this.refs.LoginForm.getValue();
    if (!validate) {
      this.setState({
        LoginErrorMessage: "Los datos del formulario son erroneos"
      });
    } else {
      this.setState({ LoginErrorMessage: "" });
      firebase
        .auth()
        .signInWithEmailAndPassword(validate.email, validate.password)
        .then(() => {
          //console.log("Login Correcto");
          this.refs.toastLogin.show("Login correcto", 150, () => {
            this.props.navigation.goBack();
          });
        })
        .catch(err => {
          console.log("Login incorrecto");
          this.refs.toastLogin.show("Login incorrecto", 2000);
        });
    }
  };

  onChangeFormLogin = formValue => {
    this.setState({
      loginData: formValue
    });
  };

  loginFacebook = async () => {
    console.log("Logueando en facebook");
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      FacebookApi.aplication_id,
      { permissions: FacebookApi.permissions }
    );
    console.log(type);
    console.log(token);
  };

  render() {
    const { LoginStruct, LoginOptions, LoginErrorMessage } = this.state;

    return (
      <View style={styles.viewBody}>
        <Image
          source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
          containerStyle={styles.containerLogo}
          style={styles.logo}
          //PlaceholderContent={<ActivityIndicator />}//spinner
          resizeMode="contain"
        />
        <View style={styles.viewForm}>
          <Form
            ref="LoginForm"
            type={LoginStruct}
            options={LoginOptions}
            value={this.state.loginData}
            onChange={formValue => this.onChangeFormLogin(formValue)}
          />
          <Button
            title="Login"
            buttonStyle={styles.buttonLoginContaine}
            onPress={this.Login}
          />
          <Text style={styles.textRegister}>
            ¿Aún no tienes una cuenta?
            <Text
              style={styles.btnRegister}
              onPress={() => this.props.navigation.navigate("Register")}
            >
              {" "}
              Registrate
            </Text>
          </Text>
          <Text style={styles.loginErrorMessage}>{LoginErrorMessage}</Text>
          <Divider style={styles.divider} />
          <SocialIcon
            title="Iniciar sesión con Facebook"
            button
            type="facebook"
            onPress={() => this.loginFacebook()}
          />
        </View>
        <Toast
          ref="toastLogin"
          position="bottom"
          positionValue={250}
          fadeInDuration={500}
          fadeOutDuration={500}
          opacity={0.8}
          textStyle={{ color: "#fff" }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 40
  },
  containerLogo: {
    alignItems: "center"
  },
  logo: {
    width: 250,
    height: 100
  },
  viewForm: {
    marginTop: 50
  },
  buttonLoginContaine: {
    backgroundColor: "#00a680",
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10
  },
  loginErrorMessage: {
    color: "#f00",
    textAlign: "center",
    marginTop: 20
  },
  divider: {
    backgroundColor: "#00a680",
    marginBottom: 20
  },
  textRegister: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10
  },
  btnRegister: {
    color: "#00a680",
    fontWeight: "bold"
  }
});
