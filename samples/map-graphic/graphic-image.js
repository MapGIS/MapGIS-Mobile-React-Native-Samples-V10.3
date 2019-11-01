import React, { Component } from 'react';
import { View } from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import { IMG_FILE_PATH } from '../utils';
import {
  Rect,
  MGMapView,
  Dot,
  PointF,
  Image,
  GraphicImage,
  GraphicText,
} from '@mapgis/mobile-react-native';

export default class MapGraphicImage extends Component {
  static navigationOptions = { title: '坐标添加图像' };
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
    var dot = new Dot();
    var center = await dot.createObj(12751000.589636726, 3568000.453292473);
    var image = new Image();
    var img = await image.createObjByLocalPath(IMG_FILE_PATH);
    var gi = new GraphicImage();
    this.graphicImage = await gi.createObj();
    await this.graphicImage.setImage(img);
    await this.graphicImage.setPoint(center);

    this.graphicsOverlay = await this.mapView.getGraphicsOverlay();
    await this.graphicsOverlay.addGraphic(this.graphicImage);
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
