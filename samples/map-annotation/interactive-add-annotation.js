import React, { Component } from 'react';
import styles from '../styles';
import {
  MGMapView,
  Rect,
  Annotation,
  Image,
  Dot,
} from '@mapgis/mobile-react-native';
import { MAPX_FILE_PATH, ANN_FILE_PATH } from '../utils';

import {
  View,
  DeviceEventEmitter,
  ToastAndroid,
  TouchableOpacity,
  Text,
} from 'react-native';

/**
 * @content 交互添加标注示例
 * @author xiaoying 2019-12-02
 */
export default class InteractiveAddAnnotation extends Component {
  static navigationOptions = { title: '交互添加标注' };

  constructor() {
    super();
  }
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.registerMapLoadListener();
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
    // 添加标注视图监听
    await this.mapView.registerAnnotationListener();
    this.map = await this.mapView.getMap();
  };

  componentDidMount() {
    this.mapLoadListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.LoadMapListener_Finish',
      async res => {
        if (res.DidFinishLoadingMap) {
          ToastAndroid.show('地图加载完成', ToastAndroid.SHORT);

          let rectModule = new Rect();
          let rect = await rectModule.createObj(
            12705276.572663,
            3542912.332349,
            12746062.17078,
            3607262.942711
          );

          await this.mapView.zoomToRange(rect, false);
        } else {
          ToastAndroid.show('地图加载失败', ToastAndroid.SHORT);
        }
      }
    );

    this.mapViewLongTapListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.long_tap_event',
      async res => {
        let pointModule = new Dot();
        let point = await pointModule.createObj(res.x, res.y);

        let description = 'x=' + res.x + '\ny=' + res.y;

        let imageModule = new Image();
        let image = await imageModule.createObjByLocalPath(ANN_FILE_PATH);

        let annotationModule = new Annotation();
        let annotation = await annotationModule.createObj(
          '标注',
          description,
          point,
          image
        );

        let annotationsOverlay = await this.mapView.getAnnotationsOverlay();
        await annotationsOverlay.addAnnotation(annotation);
        await this.mapView.refresh();
        return true;
      }
    );
  }

  componentWillUnmount = () => {
    this.mapLoadListener.remove();
    this.mapViewLongTapListener.remove();
  };

  // 开启交互式添加标注
  onOpenInteractiveAddAnnotation = async () => {
    // 移除长按事件监听
    await this.mapView.unregisterLongTapListener();
    // 添加长按事件
    await this.mapView.registerLongTapListener();
    ToastAndroid.show('操作提示：请使用长按手势添加标注', ToastAndroid.SHORT);
  };

  // 关闭交互式添加标注按钮
  onCloseAddAnnotation = async () => {
    await this.mapView.unregisterLongTapListener();
  };

  /// 清除标注
  onClearAnnotation = async () => {
    let annotationsOverlay = await this.mapView.getAnnotationsOverlay();
    await annotationsOverlay.removeAllAnnotations();
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
                this.onOpenInteractiveAddAnnotation();
              }}
            >
              <Text style={styles.text}>开启添加</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.onCloseAddAnnotation();
              }}
            >
              <Text style={styles.text}>停止添加</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.onClearAnnotation();
              }}
            >
              <Text style={styles.text}>清除标注</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
