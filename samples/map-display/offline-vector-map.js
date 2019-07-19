import React, { Component } from "react";
import { View, Text } from "react-native";

export default class OfflineVectorMap extends Component {
  static navigationOptions = { title: "离线矢量地图" };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Details Screen</Text>
      </View>
    );
  }
}
