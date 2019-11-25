import React, { Component } from 'react';
import { View, ToastAndroid } from 'react-native';
import styles from '../styles';
import {
  MGMapView,
  Map,
  MapServer,
  ServerLayer,
  Rect,
} from '@mapgis/mobile-react-native';

/**
 * @content 百度地图示例
 * @author xiaoying 2019-11-25
 */
export default class DisplayBaiDuMap extends Component {
  static navigationOptions = { title: '百度地图' };
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.showMap();
  };

  showMap = async () => {
    let mapObj = new Map();
    this.map = await mapObj.createObj();

    // 百度地图
    let mapServer = await ServerLayer.createMapServer(
      MapServer.MapServerType.MAPSERVER_TYPE_BAIDU_MAP
    );
    await mapServer.setName('BaiduMap');

    let serverLayer = new ServerLayer();
    let serverLayerObj = await serverLayer.createObj();
    await serverLayerObj.setMapServer(mapServer);
    await this.map.append(serverLayerObj);

    let isFinish = await this.mapView.setMapAsync(this.map);
    if (isFinish) {
      ToastAndroid.show('地图加载完成', ToastAndroid.SHORT);
      let rect = new Rect();
      let rectObj = await rect.createObj(
        12671545.200837,
        3470024.844769,
        12781634.12849,
        3643720.7084
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
