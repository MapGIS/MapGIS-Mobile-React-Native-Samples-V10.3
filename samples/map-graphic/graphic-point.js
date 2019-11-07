import React, { Component } from 'react';
import { View } from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import { MGMapView, Dot, GraphicMultiPoint } from '@mapgis/mobile-react-native';

/**
 * @content 坐标添加点
 * @author fjl 2019-7-26 下午2:52:36
 */
export default class MapGraphicPoint extends Component {
  static navigationOptions = { title: '坐标添加点' };
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.loadFromFile(MAPX_FILE_PATH);

    let dotModule = new Dot();
    let dotArray = [];
    let dot1 = await dotModule.createObj(12697530, 3593327);
    let dot2 = await dotModule.createObj(12736224, 3570660);
    let dot3 = await dotModule.createObj(12766215, 3612566);
    dotArray.push(dot1);
    dotArray.push(dot2);
    dotArray.push(dot3);
    let graphicMultiPointModule = new GraphicMultiPoint();
    this.graphicMultiPoint = await graphicMultiPointModule.createObj();
    await this.graphicMultiPoint.setColor('rgba(255, 0, 255, 127)');
    await this.graphicMultiPoint.setPointSize(20);
    await this.graphicMultiPoint.setPoints(dotArray);

    this.graphicsOverlay = await this.mapView.getGraphicsOverlay();
    await this.graphicsOverlay.addGraphic(this.graphicMultiPoint);
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
      </View>
    );
  }
}
