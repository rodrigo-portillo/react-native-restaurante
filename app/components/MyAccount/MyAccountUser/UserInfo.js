import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar, Button } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";

import * as firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

import UpdateUserInfo from "./UpdateUserInfo";
export default class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props,
      userInfo: {}
    };
  }
  componentDidMount = async () => {
    await this.getUserInfo();
    console.log(this.state.userInfo);
  };

  getUserInfo = () => {
    const user = firebase.auth().currentUser;
    user.providerData.forEach(userInfo => {
      this.setState({
        userInfo
      });
    });
  };

  reathenticate = currentPassword => {
    const user = firebase.auth().currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(credentials);
  };

  checkUserAvatar = photoUrl => {
    return photoUrl
      ? photoUrl
      : "https://api.adorable.io/avatars/285/abott@adorable.png";
  };

  updateUserDisplayName = async newDisplayName => {
    const update = {
      displayName: newDisplayName
    };
    await firebase.auth().currentUser.updateProfile(update);
    this.getUserInfo();
  };

  updateUserEmail = async (newEmail, password) => {
    this.reathenticate(password)
      .then(() => {
        const user = firebase.auth().currentUser;
        user
          .updateEmail(newEmail)
          .then(() => {
            this.refs.toast.show(
              "Email cambiado correctamente, vuelve a iniciar sesion",
              500,
              () => {
                firebase.auth().signOut();
              }
            );
          })
          .catch(err => {
            this.refs.toast.show(`Error al actualizar ${err}`, 500);
          });
      })
      .catch(err => {
        this.refs.toast.show("Tu contraseña no es correcta", 1000);
      });
  };

  updateUserPassword = async (currentPassword, newPassword) => {
    this.reathenticate(currentPassword)
      .then(() => {
        const user = firebase.auth().currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            this.refs.toast.show(
              "Contraseña cambiada correctamente",
              50,
              () => {
                firebase.auth().signOut();
              }
            );
          })
          .catch(err => {
            this.refs.toast.show(
              "Error del servidor, intentelo más tarde",
              1000
            );
          });
      })
      .catch(err => {
        this.refs.toast.show(
          "Tu contraseña actual introducida no es correcta",
          1000
        );
      });
  };

  returnUpdateUserInfoComponent = userInfoData => {
    if (userInfoData.hasOwnProperty("uid")) {
      return (
        <UpdateUserInfo
          userInfo={this.state.userInfo}
          updateUserDisplayName={this.updateUserDisplayName}
          updateUserEmail={this.updateUserEmail}
          updateUserPassword={this.updateUserPassword}
        ></UpdateUserInfo>
      );
    }
  };

  updateUserPhotoUrl = async photoUri => {
    const update = {
      photoURL: photoUri
    };
    await firebase.auth().currentUser.updateProfile(update);
    this.getUserInfo();
  };

  changeAvatarUser = async () => {
    const resultPermision = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    console.log(resultPermision);
    if (resultPermision.status === "denied") {
      this.refs.toast.show(
        "Es necesario aceptar los permisos de la galeria",
        800
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      if (result.cancelled) {
        this.refs.toast.show("Has cerrado la galeria", 800);
      } else {
        const { uid } = this.state.userInfo;
        console.log("UserInfo: ", this.state.userInfo);
        console.log("uid: ", uid);
        console.log("uri: ", result.uri);
        this.uploadImage(result.uri, uid)
          .then(resolve => {
            this.refs.toast.show("Avatar actualizado correctamente");
            firebase
              .storage()
              .ref("avatar/" + uid)
              .getDownloadURL()
              .then(resolve => {
                this.updateUserPhotoUrl(resolve);
              })
              .catch(err => {
                this.refs.toast.show("Error al recuperar el avatar");
              });
          })
          .catch(err => {
            this.refs.toast.show(
              "Error al actualizar el avatar, intentelo más tarde",
              800
            );
          });
      }
    }
  };

  uploadImage = async (uri, nameImage) => {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          resolve(xhr.response);
        }
      };
      xhr.open("GET", uri);
      xhr.responseType = "blob";
      xhr.send();
    })
      .then(async resolve => {
        let ref = firebase
          .storage()
          .setMaxUploadRetryTime(120000)
          .ref()
          .child("avatar/" + nameImage);
        return await ref.put(resolve);
      })
      .catch(err => {
        this.refs.toast.show("Error al subir la imagen", 800);
      });
  };

  render() {
    const { displayName, email, photoUrl } = this.state.userInfo;
    return (
      <View>
        <View style={styles.viewUserInfo}>
          <Avatar
            rounded
            size="large"
            showEditButton
            onEditPress={() => this.changeAvatarUser()}
            source={{
              uri: this.checkUserAvatar(photoUrl)
            }}
            containerStyle={styles.userInfoAvatar}
          />
          <View>
            <Text style={styles.userDisplayName}>{displayName}</Text>
            <Text>{email}</Text>
          </View>
        </View>
        {this.returnUpdateUserInfoComponent(this.state.userInfo)}
        <Button
          title="Cerrar sesión"
          onPress={() => firebase.auth().signOut()}
          buttonStyle={styles.btnCloseSesion}
          titleStyle={styles.btnCloseSessionText}
        />
        <Toast
          ref="toast"
          position="bottom"
          positionValue={250}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={(0, 8)}
          textStyle={{ color: "#fff" }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewUserInfo: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#f2f2f2"
  },
  userInfoAvatar: {
    marginRight: 20
  },
  userDisplayName: {
    fontWeight: "bold"
  },
  btnCloseSesion: {
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e3e3e3",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
    paddingTop: 10,
    paddingBottom: 10
  },
  btnCloseSessionText: {
    color: "#00a680"
  }
});
