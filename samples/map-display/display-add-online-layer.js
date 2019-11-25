import React, { Component } from 'react';
import { View, ToastAndroid } from 'react-native';
import styles from '../styles';
import { MGMapView, MapServer, ServerLayer } from '@mapgis/mobile-react-native';
import { TILE_MAPX_PATH } from '../utils';

/**
 * @content 叠加第三方在线图层示例
 * @author xiaoying 2019-11-25
 */
export default class DisplayAddOnlineLayer extends Component {
  static navigationOptions = { title: '叠加第三方在线图层' };
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.showMap();
  };

  showMap = async () => {
    let loadResult = await this.mapView.loadFromFile(TILE_MAPX_PATH);

    // 加载成功之后叠加图层
    if (loadResult > 0) {
      // 创建地图服务
      let mapServer = await ServerLayer.createMapServer(
        MapServer.MapServerType.MAPSERVER_TYPE_GOOGLE_SATELLITEMAP
      );

      let serverLayer = new ServerLayer();
      let serverLayerObj = await serverLayer.createObj();
      await serverLayerObj.setMapServer(mapServer);

      this.map = await this.mapView.getMap();
      if (this.map !== null) {
        let insertResult = await this.map.insert(0, serverLayerObj);
        if (insertResult >= 0) {
          await this.mapView.forceRefresh();
        } else {
          ToastAndroid.show(
            '在线地图叠加失败，请确保网络已连接',
            ToastAndroid.SHORT
          );
        }
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
