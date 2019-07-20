import React, { Component } from "react";
import { View } from "react-native";
import styles from "../styles";
import { TILE_MAPX_PATH } from "../utils";
import { Rect, MGMapView } from "@mapgis/mobile-react-native";

export default class OfflineTileMap extends Component {
  static navigationOptions = { title: "离线瓦片地图" };
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.loadFromFile(TILE_MAPX_PATH);
    //缩放地图到指定范围
    var R = new Rect();
    var mapRange = await R.createObj(
      9447553.589026,
      113305.17237,
      14274321.311746,
      7728872.023773
    );
    await this.mapView.zoomToRange(mapRange, false);
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
