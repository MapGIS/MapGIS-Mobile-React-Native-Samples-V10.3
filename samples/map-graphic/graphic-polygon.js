import React, { Component } from 'react';
import { View } from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import { MGMapView, Dot, GraphicPolygon } from '@mapgis/mobile-react-native';

/**
 * @content 坐标添加多边形
 * @author fjl 2019-7-26 下午2:52:36
 */
export default class MapGraphicPolygon extends Component {
  static navigationOptions = { title: '坐标添加多边形' };
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
    var dotModule = new Dot();
    var dotArray = [];
    var dot0 = await dotModule.createObj(12742678.48, 3620270.51);
    var dot1 = await dotModule.createObj(12754184.19, 3595188.06);
    var dot2 = await dotModule.createObj(12774664.36, 3611065.94);
    var dot3 = await dotModule.createObj(12742678.48, 3620270.51);
    dotArray.push(dot0);
    dotArray.push(dot1);
    dotArray.push(dot2);
    dotArray.push(dot3);
    var graphicPolygonModule = new GraphicPolygon();
    this.graphicPolygon = await graphicPolygonModule.createObj();
    await this.graphicPolygon.setColor('rgba(0, 0, 0, 180)');
    await this.graphicPolygon.setBorderlineColor('rgba(255, 153, 51, 255)');
    await this.graphicPolygon.setBorderlineWidth(10);
    await this.graphicPolygon.setPoints(dotArray, null);

    this.graphicsOverlay = await this.mapView.getGraphicsOverlay();
    await this.graphicsOverlay.addGraphic(this.graphicPolygon);

    await this.mapView.refresh();
    //缩放地图到指定范围
    // var R = new Rect();
    // var mapRange = await R.createObj(
    //     12705200,
    //     3542900,
    //     12746000,
    //     3607200
    // );
    // await this.mapView.zoomToRange(mapRange, false);
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
