import React, { Component } from 'react';
import styles from '../styles';
import {
  MGMapView,
  Rect,
  PointF,
  Annotation,
  Image,
} from '@mapgis/mobile-react-native';
import {
  MAPX_FILE_PATH,
  CONSTANT_ANN_FILE_PATH1,
  CONSTANT_ANN_FILE_PATH2,
  CONSTANT_ANN_FILE_PATH3,
} from '../utils';

import {
  View,
  DeviceEventEmitter,
  ToastAndroid,
  Dimensions,
} from 'react-native';

/**
 * @content 添加固定点标注示例
 * @author xiaoying 2019-12-02
 */
export default class ConstantPointAnnotation extends Component {
  static navigationOptions = { title: '添加固定点标注' };

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

          // 添加固定点标注
          this.addConstantAnnotation();
        } else {
          ToastAndroid.show('地图加载失败', ToastAndroid.SHORT);
        }
      }
    );
  }

  componentWillUnmount = () => {
    this.mapLoadListener.remove();
  };

  // 添加固定点标注
  addConstantAnnotation = async () => {
    let imageModule1 = new Image();
    let image1 = await imageModule1.createObjByLocalPath(
      CONSTANT_ANN_FILE_PATH1
    );

    let imageModule2 = new Image();
    let image2 = await imageModule2.createObjByLocalPath(
      CONSTANT_ANN_FILE_PATH2
    );

    let imageModule3 = new Image();
    let image3 = await imageModule3.createObjByLocalPath(
      CONSTANT_ANN_FILE_PATH3
    );

    // 获取屏幕视图的高和宽
    let { height, width } = Dimensions.get('window');
    ToastAndroid.show(
      'height: ' + height + ',width: ' + width,
      ToastAndroid.SHORT
    );

    // 设置固定标注点（屏幕视图坐标转地图坐标）
    let pointFModule1 = new PointF();
    let pointF1 = await pointFModule1.createObj(width, height);
    let pointFModule2 = new PointF();
    let pointF2 = await pointFModule2.createObj(0.9 * width, 0.95 * height);
    let pointFModule3 = new PointF();
    let pointF3 = await pointFModule3.createObj(1.5 * width, 0.7 * height);
    let position1 = await this.mapView.viewPointToMapPoint(pointF1);
    let position2 = await this.mapView.viewPointToMapPoint(pointF2);
    let position3 = await this.mapView.viewPointToMapPoint(pointF3);

    // 初始化标注对象
    let annotationModule1 = new Annotation();
    let annotation1 = await annotationModule1.createObj(
      'Annotation1',
      '标注1',
      position1,
      image1
    );
    let annotationModule2 = new Annotation();
    let annotation2 = await annotationModule2.createObj(
      'Annotation2',
      '标注2',
      position2,
      image2
    );
    let annotationModule3 = new Annotation();
    let annotation3 = await annotationModule3.createObj(
      'Annotation3',
      '标注3',
      position3,
      image3
    );

    let annotationOverlay = await this.mapView.getAnnotationsOverlay();
    await annotationOverlay.addAnnotation(annotation1);
    await annotationOverlay.addAnnotation(annotation2);
    await annotationOverlay.addAnnotation(annotation3);
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
