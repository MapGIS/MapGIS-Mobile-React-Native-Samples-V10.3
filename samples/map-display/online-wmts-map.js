import React, { Component } from 'react';
import { View, ToastAndroid } from 'react-native';
import styles from '../styles';
import { TIANDITU_TERRAIN_PATH } from '../utils';
import {
  MGMapView,
  Map,
  MapServer,
  ServerLayer,
  Rect,
} from '@mapgis/mobile-react-native';

/**
 * @content 在线WMTS地图示例
 * @author xiaoying 2019-11-25
 */
export default class OnlineWMtsMap extends Component {
  static navigationOptions = { title: '在线WMTS地图' };
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.showMap();
  };

  showMap = async () => {
    let mapObj = new Map();
    this.map = await mapObj.createObj();

    let mapServer = await ServerLayer.createMapServer(
      MapServer.MapServerType.MAPSERVER_TYPE_OGC_WMTS
    );
    await mapServer.setName('wmts');
    await mapServer.setURL(TIANDITU_TERRAIN_PATH);
    await mapServer.setAuthentication('tk', 'ad6c6a0bd9b1fa421dfd77ba49e70ecf');

    let serverLayer = new ServerLayer();
    let serverLayerObj = await serverLayer.createObj();
    await serverLayerObj.setMapServer(mapServer);

    await this.map.append(serverLayerObj);
    let isFinish = await this.mapView.setMapAsync(this.map);
    if (isFinish) {
      ToastAndroid.show('地图加载完成', ToastAndroid.SHORT);
      let rect = new Rect();
      let rectObj = await rect.createObj(
        7423643.921033,
        -3891328.011782,
        16136710.477754,
        9855954.777711
      );

      await this.mapView.zoomToRange(rectObj, false);
    } else {
      ToastAndroid.show(
        '在线地图加载失败，请确保网络已连接',
        ToastAndroid.SHORT
      );
    }
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
