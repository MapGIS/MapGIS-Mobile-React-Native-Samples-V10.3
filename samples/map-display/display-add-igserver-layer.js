import React, { Component } from 'react';
import { View, ToastAndroid, DeviceEventEmitter } from 'react-native';
import styles from '../styles';
import {
  MGMapView,
  MapServer,
  ServerLayer,
  Rect,
} from '@mapgis/mobile-react-native';
import { MAPX_FILE_PATH, IGS_WUHAN_AREA_URL } from '../utils';

/**
 * @content 叠加在线IGServer图层示例
 * @author xiaoying 2019-11-25
 */
export default class DisplayAddIGServerLayer extends Component {
  static navigationOptions = { title: '叠加在线IGServer图层' };
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.showMap();
  };

  componentDidMount() {
    this.mapLoadListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.LoadMapListener_Finish',
      async res => {
        if (res.DidFinishLoadingMap) {
          this.addLayer();
        }
      }
    );
  }

  componentWillUnmount() {
    this.mapLoadListener.remove();
  }

  showMap = async () => {
    await this.mapView.loadFromFileAsync(MAPX_FILE_PATH);
    await this.mapView.registerMapLoadListener();
  };

  // 地图叠加：本地地图文档(MAPX_FILE_PATH) + 在线IGServer矢量图层(IGS_WUHAN_AREA_URL)
  addLayer = async () => {
    // 创建地图服务
    let mapServer = await ServerLayer.createMapServer(
      MapServer.MapServerType.MAPSERVER_TYPE_IGSERVER_VECTOR
    );
    // 设置服务图层名称
    await mapServer.setName('地图服务图层');
    // 设置服务图层的URL
    await mapServer.setURL(IGS_WUHAN_AREA_URL);

    let serverLayer = new ServerLayer();
    let serverLayerObj = await serverLayer.createObj();
    await serverLayerObj.setMapServer(mapServer);

    this.map = await this.mapView.getMap();
    if (this.map !== null) {
      await this.map.append(serverLayerObj);
      let isFinish = await this.mapView.setMapAsync(this.map);
      if (isFinish) {
        ToastAndroid.show('地图加载完成', ToastAndroid.SHORT);
        let rect = new Rect();
        let rectObj = await rect.createObj(
          12703465.871193,
          3543212.894703,
          12744251.46931,
          3607563.505066
        );

        await this.mapView.zoomToRange(rectObj, false);
      } else {
        ToastAndroid.show(
          '在线地图叠加失败，请确保网络已连接',
          ToastAndroid.SHORT
        );
      }
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
