import React, { Component } from 'react';
import { View, DeviceEventEmitter } from 'react-native';
import styles from '../styles';
import { MGMapView, Dot, MapPosition } from '@mapgis/mobile-react-native';
import { BUIDING_FILE_PATH } from '../utils';

/**
 * @content 三维场景地图（灰度模型）示例
 * @author xiaoying 2019-11-25
 */
export default class Display3DViewMap extends Component {
  static navigationOptions = { title: '三维场景地图（灰度模型）' };
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.showMap();
  };

  componentDidMount() {
    this.mapLoadListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.LoadMapListener_Finish',
      async res => {
        if (res.DidFinishLoadingMap) {
          this.animationMapView();
        }
      }
    );
  }

  componentWillUnmount() {
    this.mapLoadListener.remove();
  }

  showMap = async () => {
    await this.mapView.loadFromFileAsync(BUIDING_FILE_PATH);
    await this.mapView.registerMapLoadListener();
  };

  animationMapView = async () => {
    // 中心点
    let centerDotJS = new Dot();
    let centerDot = await centerDotJS.createObj(
      12734840.911782857,
      3568731.256785354
    );

    // 旋转中心点
    let rotateCenterDotJS = new Dot();
    let rotateCenterDot = await rotateCenterDotJS.createObj(
      12734947.334961485,
      3568606.05406966
    );

    let mapPositionJS = new MapPosition();
    let mapPosition = await mapPositionJS.createObj(
      centerDot._MGDotId,
      0.462913295,
      rotateCenterDot._MGDotId,
      -19.78676,
      58.281357
    );

    await this.mapView.animatePosition(mapPosition, 2500);
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
