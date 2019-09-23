import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, Image } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";

import * as firebase from "firebase";

import t from "tcomb-form-native";
import { RegisterStruct, RegisterOptions } from "../../forms/Register";
const Form = t.form.Form;

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      registerStruct: RegisterStruct,
      registerOptions: RegisterOptions,
      formData: {
        name: "",
        email: "",
        password: "",
        passwordConfirmation: ""
      },
      formErrorMessage: ""
    };
  }

  register = () => {
    const { password, passwordConfirmation } = this.state.formData;
    if (password === passwordConfirmation) {
      const validate = this.refs.registerForm.getValue();
      if (validate) {
        this.setState({ formErrorMessage: "" });
        firebase
          .auth()
          .createUserWithEmailAndPassword(validate.email, validate.password)
          .then(resolve => {
            console.log("Registro exitoso");
            this.refs.toast.show("Registro exitoso!", 200, () => {
              //this.props.navigation.navigate("MyAccount");
              this.props.navigation.goBack();
            });
          })
          .catch(error => {
            this.refs.toast.show("El email ya está en uso.", 100);
          });
      } else {
        /*this.setState({
          formErrorMessage: "Formulario invalido"
        });*/
        this.refs.toast.show("Formulario invalido", 100);
      }
    } else {
      /*this.setState({
        formErrorMessage: "Contraseñas no son iguales"
      });*/
      this.refs.toast.show("Contraseñas no son iguales", 100);
    }
    //  console.log(this.state.formData);
  };

  onChangeFormRegister = formValue => {
    this.setState({
      formData: formValue
    });
    //console.log(this.state.formData);
  };

  render() {
    const { registerStruct, registerOptions, formErrorMessage } = this.state;

    return (
      <View style={styles.viewBody}>
        <Image
          source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
          containerStyle={styles.containerLogo}
          style={styles.logo}
          resizeMode="contain"
        />
        <Form
          ref="registerForm"
          type={registerStruct}
          options={registerOptions}
          value={this.state.formData}
          onChange={formValue => this.onChangeFormRegister(formValue)}
        />
        <Button
          buttonStyle={styles.buttonRegisterContainer}
          title="Unirse"
          onPress={() => this.register()}
        />
        <Text style={styles.formErrorMessage}>{formErrorMessage}</Text>
        <Toast
          ref="toast"
          position="bottom"
          positionValue={250}
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
    flex: 1,
    justifyContent: "center",
    marginLeft: 40,
    marginRight: 40
  },
  buttonRegisterContainer: {
    backgroundColor: "#00a680",
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10
  },
  formErrorMessage: {
    color: "#f00",
    textAlign: "center",
    marginTop: 30
  },
  containerLogo: {
    alignItems: "center",
    marginBottom: 20
  },
  logo: {
    width: 250,
    height: 100
  }
});
