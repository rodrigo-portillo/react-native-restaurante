import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";

import { Image } from "react-native-elements";

import ActionButton from "react-native-action-button";
//import * as firebase from "firebase";
import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default class Restaurant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: false,
      restaurant: null,
      startRestaurants: null,
      limitRestaurant: 8,
      isLoading: true
    };
  }

  componentDidMount() {
    this.checkLogin();
    this.loadRestaurants();
  }

  checkLogin = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          login: true
        });
      } else {
        this.setState({
          login: false
        });
      }
    });
  };

  loadActionButton = () => {
    const { login } = this.state;
    if (login) {
      return (
        <ActionButton
          buttonColor="#00a680"
          onPress={() =>
            this.props.navigation.navigate("AddRestaurant", {
              loadRestaurants: this.loadRestaurants
            })
          }
        />
      );
    }

    return null;
  };

  loadRestaurants = async () => {
    const { limitRestaurant } = this.state;
    let resultRestaurants = [];

    const restaurants = db
      .collection("restaurants")
      .orderBy("createAt", "desc")
      .limit(limitRestaurant);

    await restaurants.get().then(response => {
      this.setState({
        startRestaurants: response.docs[response.docs.length - 1]
      });

      response.forEach(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        resultRestaurants.push({ restaurant });
      });
    });

    this.setState({
      restaurants: resultRestaurants
    });
  };

  handleLoadMore = async () => {
    const { limitRestaurant, startRestaurants } = this.state;
    let resultRestaurants = [];

    this.state.restaurants.forEach(doc => {
      resultRestaurants.push(doc);
    });

    const restaurantDB = db
      .collection("restaurant")
      .orderBy("createAt", "desc")
      .startAfter(startRestaurants.data().createAt)
      .limit(limitRestaurant);

    await restaurantDB.get().then(response => {
      if (response.docs.length > 0) {
        this.setState({
          startLoadRestaurant: response.docs[response.docs.length - 1]
        });
      } else {
        this.setState({
          isLoading: false
        });
      }

      response.forEach(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        resultRestaurants.push({ restaurant });
      });

      this.setState({
        restaurants: resultRestaurants
      });
    });
  };

  renderRow = restaurant => {
    const {
      name,
      city,
      address,
      description,
      image
    } = restaurant.item.restaurant;

    return (
      <TouchableOpacity onPress={() => this.clickRestaurante(restaurant)}>
        <View style={styles.viewRestaurant}>
          <View style={styles.viewRestaurantImage}>
            <Image
              resizeMode="cover"
              source={{ uri: image }}
              style={styles.imageRestaurant}
            />
          </View>
          <View>
            <Text style={styles.FlatListRestaurantName}>{name} </Text>
            <Text style={styles.FlastListRestaurantAddress}>
              {(city, address)}
            </Text>
            <Text style={styles.FlatListRestaurantDescription}>
              {description.substr(0, 60)} ...
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderFooter = () => {
    if (this.state.isLoading) {
      return (
        <View style={styles.loaderRestaurants}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <View style={styles.notFoundRestaurant}>
          <Text>No quedan restaurantes por cargar</Text>
        </View>
      );
    }
  };

  renderFlasList = restaurants => {
    if (restaurants) {
      return (
        <FlatList
          data={this.state.restaurants}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0}
          ListFooterComponent={this.renderFooter}
        />
      );
    } else {
      return (
        <View style={styles.startLoadRestaurant}>
          <ActivityIndicator size="large" />
          <Text>Cargando</Text>
        </View>
      );
    }
  };

  clickRestaurante = restaurant => {
    this.props.navigation.navigate("Restauran", { restaurant });
  };

  render() {
    const { restaurants } = this.state;

    return (
      <View style={styles.viewBody}>
        {this.renderFlasList(restaurants)}
        {this.loadActionButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  startLoadRestaurant: {
    marginTop: 20,
    alignItems: "center"
  },
  viewRestaurant: {
    flexDirection: "row",
    margin: 10
  },
  imageRestaurant: {
    width: 80,
    height: 80
  },
  viewRestaurantImage: {
    marginRight: 15
  },
  FlatListRestaurantName: {
    fontWeight: "bold"
  },
  FlastListRestaurantAddress: {
    paddingTop: 2,
    color: "grey"
  },
  FlatListRestaurantDescription: {
    paddingTop: 2,
    color: "grey",
    width: 300
  },
  loaderRestaurants: {
    marginTop: 10,
    marginBottom: 10
  },
  notFoundRestaurant: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center"
  }
});
