import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { Card, Image, Rating } from 'react-native-elements';

import { firebaseApp } from "../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
//import { height } from "window-size";
const db = firebase.firestore(firebaseApp);

export default class TopFive extends Component {

  constructor() {
    super();
    this.state = {
      restaurants: []
    }
  }

  componentDidMount = () => {
    this.loadTopFiveRestaurant();
  }

  loadTopFiveRestaurant = async () => {
    const restaurant = db.collection("restaurants").orderBy("rating", "desc").limit(5);

    let restaurantArray = [];

    await restaurant.get().then(response => {
      response.forEach(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        restaurantArray.push(restaurant);
      })

    })

    this.setState({
      restaurants: restaurantArray
    })


  }

  renderRestaurant = (restaurants) => {
    if (restaurants) {
      return (
        <ScrollView>
          {restaurants.map((restaurant, index) => {
            let restaurantClick = {
              item: {
                restaurant: null
              }
            }
            restaurantClick.item.restaurant = restaurant;
            return (
              <TouchableOpacity key={index} onPress={() => this.clickRestaurant(restaurantClick)}>
                <Card>
                  <Image
                    style={styles.restaurantImage}
                    resizeMode="cover"
                    source={{ uri: restaurant.image }} />
                  <View style={styles.titleRating}>
                    <Text style={styles.title} >{restaurant.name}</Text>
                    <Rating
                      imageSize={20}
                      startingValue={restaurant.rating}
                      readonly
                      style={styles.rating}
                    />
                  </View>
                  <Text style={styles.description}>{restaurant.description}</Text>
                </Card>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      )
    } else {
      return (
        <View><ActivityIndicator size="large" /><Text>Cargando Restaurante</Text></View>
      )
    }
  }

  clickRestaurant = restaurant => {
    this.props.navigation.navigate("Restauran", { restaurant });
  }

  render() {
    const { restaurants } = this.state;
    return (
      <View style={styles.viewBody}>
        {this.renderRestaurant(restaurants)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  restaurantImage: {
    width: "100%",
    height: 200
  },
  titleRating: {
    flexDirection: "row",
    marginTop: 10
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  rating: {
    position: "absolute",
    right: 0
  },
  description: {
    color: "gray",
    marginTop: 10,
    textAlign: "justify"
  }
});
