import React, { Component } from 'react';
import { View, DeviceEventEmitter } from 'react-native';
import styles from '../styles';
import { TILE_MAPX_PATH, TILE_FILE_PATH } from '../utils';
import { Rect, MGMapView, Document, ImageLayer, MapServer, Map } from '@mapgis/mobile-react-native';

export default class MapSplitScreen extends Component {
  static navigationOptions = { title: '地图分屏功能' };
  onGetInstance1 = mapView => {
    this.mapView = mapView;
    this.openMap1();
  };
  
  onGetInstance2 = mapView2 => {
    this.mapView2 = mapView2;
    this.openMap2();
  };

  componentDidMount() {
    this.mapTapListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.single_tap_event',
      res => {
        if (res.ObjId === this.mapView._MGMapViewId) {
          console.log('Map1 短按事件监听');
        } else if (res.ObjId === this.mapView2._MGMapViewId) {
          console.log('Map2 短按事件监听');
        }
      },
    );
  }

  componentWillUnmount() {
    this.mapTapListener.remove();
  }

  openMap1 = async () => {
    await this.mapView.loadFromFile(TILE_MAPX_PATH);
    await this.mapView.registerTapListener();
  };

  openMap2 = async () => {
    //创建服务图层
    let serverLayer = await ImageLayer.createInstance();
    //创建地图服务
    let mapserver = await ImageLayer.createMapServer(
      MapServer.MapServerType.MAPSERVER_TYPE_TDF,
    );
    //为地图服务设置URL：tdf瓦片文件路径
    await mapserver.setURL(TILE_FILE_PATH);
    //为服务图层设置地图服务
    await serverLayer.setMapServer(mapserver);

    let map = await Map.createInstance();
    await map.append(serverLayer);

    //同步方法
    await this.mapView2.setMap(map);
    await this.mapView2.registerTapListener();
  };

  render() {
    return (
      <View style={styles.container}>
        <MGMapView
          ref="mapView"
          onGetInstance={this.onGetInstance1}
          style={styles.mapView}
        />
        <View style={styles.splitLine} />
        <MGMapView
          ref="mapView"
          onGetInstance={this.onGetInstance2}
          style={styles.mapView}
        />
      </View>
    );
  }
}
