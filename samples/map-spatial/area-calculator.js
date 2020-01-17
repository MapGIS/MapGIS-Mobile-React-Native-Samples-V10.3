import React, { Component } from 'react';
import {
  View,
  DeviceEventEmitter,
  ToastAndroid,
  PixelRatio,
} from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import {
  MGMapView,
  Rect,
  PointF,
  GraphicText,
  Graphic,
  GraphicPolygon,
} from '@mapgis/mobile-react-native';

export default class MapCalculateArea extends Component {
  static navigationOptions = { title: '面积量算' };

  constructor() {
    super();
  }

  onLayout = event => {
    this.mapViewHeight = event.nativeEvent.layout.height * PixelRatio.get();
    this.mapViewWidth = event.nativeEvent.layout.width * PixelRatio.get();
  };

  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.registerMapLoadListener();
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
  };

  componentDidMount() {
    this.mapLoadListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.LoadMapListener_Finish',
      async res => {
        if (res.DidFinishLoadingMap) {
          ToastAndroid.show('地图加载完成', ToastAndroid.SHORT);
          //缩放地图到指定范围
          let rect = new Rect();
          let rectObj = await rect.createObj(
            12705276.572663,
            3542912.332349,
            12746062.17078,
            3607262.942711
          );

          await this.mapView.zoomToRange(rectObj, false);

          //计算固定多边形的面积
          this.calArea();
        }
      }
    );
  }

  componentWillUnmount = () => {
    this.mapLoadListener.remove();
  };

  /**
   * 计算空间多边形面积
   */
  async calArea() {
    this.graphicsOverlay = await this.mapView.getGraphicsOverlay();

    //根据屏幕的高宽自定义坐标点
    let pointF = new PointF();
    let pointFObj1 = await pointF.createObj(
      (this.mapViewWidth * 1.0) / 10,
      (this.mapViewHeight * 1.0) / 10
    );
    let pointFObj2 = await pointF.createObj(
      (this.mapViewWidth * 4.0) / 10,
      (this.mapViewHeight * 1.0) / 10
    );
    let pointFObj3 = await pointF.createObj(
      (this.mapViewWidth * 5.0) / 10,
      (this.mapViewHeight * 3.0) / 10
    );
    let pointFObj4 = await pointF.createObj(
      (this.mapViewWidth * 3.5) / 10,
      (this.mapViewHeight * 4.5) / 10
    );
    let pointFObj5 = await pointF.createObj(
      (this.mapViewWidth * 2.0) / 10,
      (this.mapViewHeight * 4.5) / 10
    );

    //将视图坐标转化为地图坐标
    let dot1 = await this.mapView.viewPointToMapPoint(pointFObj1);
    let dot2 = await this.mapView.viewPointToMapPoint(pointFObj2);
    let dot3 = await this.mapView.viewPointToMapPoint(pointFObj3);
    let dot4 = await this.mapView.viewPointToMapPoint(pointFObj4);
    let dot5 = await this.mapView.viewPointToMapPoint(pointFObj5);
    let dot6 = await this.mapView.viewPointToMapPoint(pointFObj1);
    //把地图坐标dot添加大dots数组中
    let dotArr = [];
    dotArr.push(dot1);
    dotArr.push(dot2);
    dotArr.push(dot3);
    dotArr.push(dot4);
    dotArr.push(dot5);
    dotArr.push(dot6);
    //创建多边形对象与文本对象
    let graphicPolygon = new GraphicPolygon();
    let graphicText = new GraphicText();
    let graphicPolygonObj = await graphicPolygon.createObj();
    let graphicTextObj = await graphicText.createObj();
    //设置多边形点集与样式
    await graphicPolygonObj.setPoints(dotArr, null);
    await graphicPolygonObj.setColor('rgba(0, 0, 0, 180)');
    await graphicPolygonObj.setBorderlineColor('rgba(255, 153, 51, 255)');
    await graphicPolygonObj.setBorderlineWidth(5);

    //将自定义图形转化为几何图形，然后计算多边形面积
    let geoPolygon = await Graphic.toGeometry(graphicPolygonObj);

    //第一种方法：计算几何面积
    //let area = geoPolygon.calArea();

    //第二种方法：计算实地面积
    let map = await this.mapView.getMap();
    let refData = await map.getSRSInfo();
    let area = await geoPolygon.calArea(refData);

    //设置text显示计算结果
    await graphicTextObj.setPoint(dot3);
    await graphicTextObj.setFontSize(40);
    await graphicTextObj.setText('多边形的面积' + area + '平方米');

    //把折线与计算结果添加到地图图层并刷新
    await this.graphicsOverlay.addGraphic(graphicPolygonObj);
    await this.graphicsOverlay.addGraphic(graphicTextObj);
    await this.mapView.refresh();

    //平移地图
    await this.mapView.panToCenter(dot3, true);
  }

  render() {
    return (
      <View style={styles.container}>
        <MGMapView
          ref="mapView"
          onGetInstance={this.onGetInstance}
          style={styles.mapView}
          onLayout={event => this.onLayout(event)}
        />
      </View>
    );
  }
}
