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
import { TIANDITU_VECTOR_PATH, TIANDITU_ANNO_PATH } from '../utils';

/**
 * @content 天地图示例
 * @author xiaoying 2019-11-25
 */
export default class DisplayTianDiTuMap extends Component {
  static navigationOptions = { title: '天地图' };
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.showMap();
  };

  showMap = async () => {
    let mapObj = new Map();
    this.map = await mapObj.createObj();

    // 天地图矢量
    let mapServer = await ServerLayer.createMapServer(
      MapServer.MapServerType.MAPSERVER_TYPE_TIANDITU
    );
    await mapServer.setName('Tianditu_vec');
    await mapServer.setAuthentication('tk', 'ad6c6a0bd9b1fa421dfd77ba49e70ecf');
    await mapServer.setURL(TIANDITU_VECTOR_PATH);

    let serverLayer = new ServerLayer();
    let serverLayerObj = await serverLayer.createObj();
    await serverLayerObj.setMapServer(mapServer);
    await this.map.append(serverLayerObj);
    // 天地图注记
    let mapServerAnno = await ServerLayer.createMapServer(
      MapServer.MapServerType.MAPSERVER_TYPE_TIANDITU
    );
    await mapServerAnno.setName('Tianditu_cva');
    await mapServerAnno.setAuthentication(
      'tk',
      'ad6c6a0bd9b1fa421dfd77ba49e70ecf'
    );
    await mapServerAnno.setURL(TIANDITU_ANNO_PATH);

    let serverLayerAnno = new ServerLayer();
    let serverLayerAnnoObj = await serverLayerAnno.createObj();
    await serverLayerAnnoObj.setMapServer(mapServer);
    await this.map.append(serverLayerAnnoObj);

    let isFinish = await this.mapView.setMapAsync(this.map);
    if (isFinish) {
      ToastAndroid.show('地图加载完成', ToastAndroid.SHORT);
      let rect = new Rect();
      let rectObj = await rect.createObj(
        113.702281,
        29.969077,
        115.082573,
        31.36126
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
