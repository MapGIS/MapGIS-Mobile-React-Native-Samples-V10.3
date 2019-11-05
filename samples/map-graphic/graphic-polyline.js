import React, { Component } from 'react';
import { View } from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import {
  Rect,
  MGMapView,
  Dot,
  GraphicPolylin,
  GraphicMultiPoint,
  GraphicPolygon,
} from '@mapgis/mobile-react-native';

/**
 * @content 坐标添加线
 * @author fjl 2019-7-26 下午2:52:36
 */
export default class MapGraphicPolyline extends Component {
  static navigationOptions = { title: '坐标添加线' };
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
    var dotModule = new Dot();
    var dotArray = [];
    var dot1 = await dotModule.createObj(12697530, 3593327);
    var dot2 = await dotModule.createObj(12736224, 3570660);
    var dot3 = await dotModule.createObj(12766215, 3612566);
    dotArray.push(dot1);
    dotArray.push(dot2);
    dotArray.push(dot3);
    var graphicPolylinModule = new GraphicPolylin();
    this.graphicPolylin = await graphicPolylinModule.createObj();
    await this.graphicPolylin.setLineWidth(10);
    await this.graphicPolylin.setPoints(dotArray);

    this.graphicsOverlay = await this.mapView.getGraphicsOverlay();
    await this.graphicsOverlay.addGraphic(this.graphicPolylin);
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
