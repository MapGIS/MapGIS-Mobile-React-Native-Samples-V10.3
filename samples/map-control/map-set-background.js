import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  DeviceEventEmitter,
  ToastAndroid,
} from 'react-native';
import styles from '../styles';
import { MGMapView, Image } from '@mapgis/mobile-react-native';
import { MAPX_FILE_PATH, MAP_BG_IMG_FILE_PATH } from '../utils';

/**
 * @content 地图背景设置示例
 * @author xiaoying 2019-11-25
 */

export default class MapSetBackground extends Component {
  static navigationOptions = { title: '地图背景设置' };

  constructor() {
    super();
  }
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  componentDidMount() {
    this.mapLoadListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.LoadMapListener_Finish',
      async res => {
        if (res.DidFinishLoadingMap) {
          ToastAndroid.show('地图加载完成', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('地图加载失败', ToastAndroid.SHORT);
        }
      }
    );
  }

  componentWillUnmount() {
    this.mapLoadListener.remove();
  }

  openMap = async () => {
    await this.mapView.registerMapLoadListener();
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
    this.map = await this.mapView.getMap();
  };

  // 设置背景图片
  setBgPicture = async () => {
    let imageModule = new Image();
    let image = await imageModule.createObjByLocalPath(MAP_BG_IMG_FILE_PATH);
    await this.mapView.setBackGroundImage(image);
    await this.mapView.refresh();
  };

  // 设置背景颜色
  setBgColor = async colorStr => {
    // 不设置图片
    await this.mapView.setBackGroundImage(null);
    // 设置背景颜色
    await this.mapView.setBackGroundColor(colorStr);
    await this.mapView.refresh();
  };

  render() {
    return (
      <View style={styles.container}>
        <MGMapView
          ref="mapView"
          onGetInstance={this.onGetInstance}
          style={styles.mapView}
        />

        <View style={styles.buttons}>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.setBgPicture();
              }}
            >
              <Text style={styles.text}>背景图片</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.setBgColor('rgba(180, 204, 204, 204)');
              }}
            >
              <Text style={styles.text}>背景颜色</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.setBgColor('rgba(255, 255, 255, 0)');
              }}
            >
              <Text style={styles.text}>重置</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
