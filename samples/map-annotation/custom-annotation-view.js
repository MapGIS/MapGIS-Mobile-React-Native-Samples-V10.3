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

import { View, DeviceEventEmitter, ToastAndroid } from 'react-native';

/**
 * @content 自定义标注视图示例
 * @author xiaoying 2019-12-02
 */
export default class CustomAnnotationView extends Component {
  static navigationOptions = { title: '自定义标注视图' };

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

          // 添加固定点标注
          this.addConstantAnnotation();
        } else {
          ToastAndroid.show('地图加载失败', ToastAndroid.SHORT);
        }
      }
    );

    this.mapViewViewForAnnotationListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.AnnotationListenerA_ViewByAnn',
      async res => {}
    );

    this.mapViewClickAnnotationViewListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.AnnotationListenerA_ClickAnnView',
      async res => {
        ToastAndroid.show('标注视图被点击！', ToastAndroid.SHORT);
      }
    );

    this.mapViewClickAnnotationListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.AnnotationListenerA_ClickAnn',
      async res => {
        ToastAndroid.show('标注被点击！', ToastAndroid.SHORT);
      }
    );
  }

  componentWillUnmount = () => {
    this.mapLoadListener.remove();
    this.mapViewViewForAnnotationListener.remove();
    this.mapViewClickAnnotationViewListener.remove();
    this.mapViewClickAnnotationListener.remove();
  };

  // 添加固定点标注
  addConstantAnnotation = async () => {
    let imageModule1 = new Image();
    let image = await imageModule1.createObjByLocalPath(ANN_FILE_PATH);

    // 标注点位置
    let positionModule = new Dot();
    let position = await positionModule.createObj(12724100, 3573729.6);
    // 标注名称
    let name = '黄鹤楼';
    // 标注内容
    let content = '黄鹤楼位于湖北省武汉市长\n江南岸的武昌蛇山之巅……';
    // 标注点简介图
    let img = 'hhl';
    this.addLabel(image, position, name, content, img);
  };

  addLabel = async (image, dot, name, content, img) => {
    // 标注绘制层
    let annotationOverlay = await this.mapView.getAnnotationsOverlay();
    // 初始化标注对象
    let annotationModule1 = new Annotation();
    let annotation = await annotationModule1.createObjByUID(
      img,
      name,
      content,
      dot,
      image
    );
    // 设置可以显示标注视图
    await annotation.setCanShowAnnotationView(true);
    // 添加标注
    await annotationOverlay.addAnnotation(annotation);
    // 显示标注视图
    await annotation.showAnnotationView();
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
