import React, { Component } from 'react';
import { View } from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import { MGMapView, Dot, GraphicCircle } from '@mapgis/mobile-react-native';

export default class MapGraphicPoint extends Component {
  static navigationOptions = { title: '坐标添加圆' };
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.loadFromFile(MAPX_FILE_PATH);

    let dotModule = new Dot();
    let dot = await dotModule.createObj(12729985, 3606886);

    let graphicCircleModule = new GraphicCircle();
    this.graphicCircle = await graphicCircleModule.createObj();
    await this.graphicCircle.setColor('rgba(255, 255, 255, 180)');
    await this.graphicCircle.setCenterAndRadius(dot, 10000);
    await this.graphicCircle.setBorderlineColor('rgba(255, 153, 51, 255)');
    await this.graphicCircle.setBorderlineWidth(10);

    this.graphicsOverlay = await this.mapView.getGraphicsOverlay();
    await this.graphicsOverlay.addGraphic(this.graphicCircle);
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
