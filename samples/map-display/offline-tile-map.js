import React, { Component } from "react";
import { View, Text } from "react-native";

export default class OfflineTileMap extends Component {
  static navigationOptions = { title: "离线瓦片地图" };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Details Screen</Text>
      </View>
    );
  }
}
