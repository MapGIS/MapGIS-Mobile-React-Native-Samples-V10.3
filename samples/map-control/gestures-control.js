import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import { MGMapView } from '@mapgis/mobile-react-native';
import { Switch } from '../common';

export default class MapGesturesControl extends Component {
  static navigationOptions = { title: '地图手势控制' };

  constructor() {
    super();
    this.state = {
      doubleTapZooming: true,
      twoFingerTapZooming: true,
      mapZoomGesturesEnabled: true,
      mapPanGesturesEnabled: true,
      mapSlopeGestures: true,
      mpRotateGestures: true,
    };
  }

  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.controls}>
          <View style={styles.control}>
            <Text style={styles.label}>放大</Text>
            <Text style={styles.description}>单指双击</Text>
            <Switch
              onValueChange={async doubleTapZooming => {
                this.setState({ doubleTapZooming });
                await this.mapView.setDoubleTapZooming(doubleTapZooming);
              }}
              value={this.state.doubleTapZooming}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>缩小</Text>
            <Text style={styles.description}>双指单击</Text>
            <Switch
              onValueChange={async twoFingerTapZooming => {
                this.setState({ twoFingerTapZooming });
                await this.mapView.setTwoFingerTapZooming(twoFingerTapZooming);
                await this.mapView.refresh();
              }}
              value={this.state.twoFingerTapZooming}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>缩放</Text>
            <Text style={styles.description}>双指捏拉</Text>
            <Switch
              onValueChange={async mapZoomGesturesEnabled => {
                this.setState({ mapZoomGesturesEnabled });
                await this.mapView.setMapZoomGesturesEnabled(
                  mapZoomGesturesEnabled
                );
                await this.mapView.refresh();
              }}
              value={this.state.mapZoomGesturesEnabled}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>滑动</Text>
            <Text style={styles.description}>单指滑动</Text>
            <Switch
              onValueChange={async mapPanGesturesEnabled => {
                this.setState({ mapPanGesturesEnabled });
                await this.mapView.setMapPanGesturesEnabled(
                  mapPanGesturesEnabled
                );
                await this.mapView.refresh();
              }}
              value={this.state.mapPanGesturesEnabled}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>倾斜</Text>
            <Text style={styles.description}>双指竖直滑动</Text>
            <Switch
              onValueChange={async mapSlopeGestures => {
                this.setState({ mapSlopeGestures });
                await this.mapView.setMapSlopeGesturesEnabled(mapSlopeGestures);
                await this.mapView.refresh();
              }}
              value={this.state.mapSlopeGestures}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>旋转</Text>
            <Text style={styles.description}>双指旋转</Text>
            <Switch
              onValueChange={async mpRotateGestures => {
                this.setState({ mpRotateGestures });
                await this.mapView.setMapRotateGesturesEnabled(
                  mpRotateGestures
                );
                await this.mapView.refresh();
              }}
              value={this.state.mpRotateGestures}
            />
          </View>
        </View>
        <MGMapView
          ref="mapView"
          onGetInstance={this.onGetInstance}
          style={styles.mapView}
        />
      </View>
    );
  }
}
