import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  DeviceEventEmitter,
  ToastAndroid,
} from 'react-native';
import styles from '../styles';
import { MGMapView, Rect, Environment } from '@mapgis/mobile-react-native';
import { MAPX_FILE_PATH, SYSTEM_LIB_PATH1, SYSTEM_LIB_PATH2 } from '../utils';

/**
 * @content 系统路径设置示例
 * @author xiaoying 2019-11-25
 */

export default class MapSetSystemLibrary extends Component {
  static navigationOptions = { title: '系统路径设置' };

  constructor() {
    super();
  }
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  componentDidMount() {
    DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.LoadMapListener_Finish',
      async res => {
        if (res.DidFinishLoadingMap) {
          ToastAndroid.show('地图加载完成', ToastAndroid.SHORT);
          let rect = new Rect();
          let rectObj = await rect.createObj(
            12705276.572663,
            3542912.332349,
            12746062.17078,
            3607262.942711
          );

          await this.mapView.zoomToRange(rectObj, false);
        } else {
          ToastAndroid.show('地图加载失败', ToastAndroid.SHORT);
        }
      }
    );
  }

  componentWillUnmount() {
    // 恢复系统库为系统库1
    this.setSystemLibrary(SYSTEM_LIB_PATH1);
  }

  openMap = async () => {
    await this.mapView.registerMapLoadListener();
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
  };

  // 设置系统库
  setSystemLibrary = async path => {
    let environmentModule = new Environment();
    let environment = await environmentModule.createObj();
    await environment.setSystemLibraryPath(path);
    await this.mapView.forceRefresh();
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
                this.setSystemLibrary(SYSTEM_LIB_PATH2);
              }}
            >
              <Text style={styles.text}>系统库1</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.setSystemLibrary(SYSTEM_LIB_PATH1);
              }}
            >
              <Text style={styles.text}>系统库2</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
