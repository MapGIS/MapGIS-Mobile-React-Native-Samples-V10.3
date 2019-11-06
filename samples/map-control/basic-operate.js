/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PixelRatio,
} from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import { MGMapView } from '@mapgis/mobile-react-native';

export default class MapBasicOperate extends Component {
  static navigationOptions = { title: '地图基本操作' };

  onLayout = event => {
    this.mapViewHeight = event.nativeEvent.layout.height * PixelRatio.get();
    this.mapViewWidth = event.nativeEvent.layout.width * PixelRatio.get();
    this.mapViewCenterX = this.mapViewWidth / 2;
    this.mapViewCenterY = this.mapViewHeight / 2;
  };

  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
    this.mapCenterPoint = await this.mapView.getCenterPoint();
  };

  zoomIn = async () => {
    await this.mapView.zoomIn(true);
  };

  zoomOut = async () => {
    await this.mapView.zoomOut(true);
  };

  rotate = async () => {
    await this.mapView.rotate(
      20,
      this.mapViewCenterX,
      this.mapViewCenterY,
      true
    );
  };

  slope = async () => {
    let slopeAngle = await this.mapView.getSlopeAngle();
    slopeAngle = slopeAngle + 10.0;
    await this.mapView.setSlopeAngle(slopeAngle, true);
  };

  move = async () => {
    await this.mapView.moveMap(
      this.mapViewCenterX / 10,
      this.mapViewCenterY / 10,
      true
    );
  };

  zoomTo = async () => {
    await this.mapView.zoomToCenter(this.mapCenterPoint, 5.0, true);
  };

  restore = async () => {
    await this.mapView.restore(true);
  };

  render() {
    return (
      <View style={styles.container}>
        <MGMapView
          ref="mapView"
          onGetInstance={this.onGetInstance}
          style={styles.mapView}
          onLayout={event => this.onLayout(event)}
        />
        <View style={styles.buttons}>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.zoomIn}>
              <Text style={styles.text}>放大</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.zoomOut}>
              <Text style={styles.text}>缩小</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.rotate}>
              <Text style={styles.text}>旋转</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.slope}>
              <Text style={styles.text}>倾斜</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.move}>
              <Text style={styles.text}>移动</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.zoomTo}>
              <Text style={styles.text}>跳转</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.restore}>
              <Text style={styles.text}>复位</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
