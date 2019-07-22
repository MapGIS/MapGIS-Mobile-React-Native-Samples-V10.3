import React, { Component } from "react";
import { View } from "react-native";
import styles from "../styles";
import { SERVER_DOC_MAPX_PATH } from "../utils";
import { Rect, MGMapView } from "@mapgis/mobile-react-native";

export default class OfflineVectorMap extends Component {
  static navigationOptions = { title: "在线矢量地图" };
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.loadFromFile(SERVER_DOC_MAPX_PATH);
  };

  render() {
    return (
      <View style={styles.container}>
        <MGMapView
          ref="mapView"
          onGetInstance={this.onGetInstance}
          style={styles.mapView}
        />
      </View>
    );
  }
}
