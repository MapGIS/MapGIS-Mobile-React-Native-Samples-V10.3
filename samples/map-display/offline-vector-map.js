import React, { Component } from 'react';
import { View } from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import { Rect, MGMapView } from '@mapgis/mobile-react-native';

export default class OfflineVectorMap extends Component {
  static navigationOptions = { title: '离线矢量地图' };
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
    //缩放地图到指定范围
    var R = new Rect();
    var mapRange = await R.createObj(
      12705276.572663,
      3542912.332349,
      12746062.17078,
      3607262.942711
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
