import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import { MGMapView } from '@mapgis/mobile-react-native';
import { Switch } from '../common';

export default class MapUIControl extends Component {
  static navigationOptions = { title: '地图界面操作' };

  constructor() {
    super();
    this.state = {
      showZoomControls: true,
      showLogo: true,
      showScaleBar: true,
      showNorthArrow: true,
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
            <Text style={styles.label}>缩放按钮</Text>
            <Switch
              onValueChange={async showZoomControls => {
                this.setState({ showZoomControls });
                await this.mapView.setZoomControlsEnabled(showZoomControls);
              }}
              value={this.state.showZoomControls}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>Logo图标</Text>
            <Switch
              onValueChange={async showLogo => {
                this.setState({ showLogo });
                await this.mapView.setShowLogo(showLogo);
                await this.mapView.refresh();
              }}
              value={this.state.showLogo}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>指北针</Text>
            <Switch
              onValueChange={async showNorthArrow => {
                this.setState({ showNorthArrow });
                await this.mapView.setShowNorthArrow(showNorthArrow);
                await this.mapView.refresh();
              }}
              value={this.state.showNorthArrow}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>比例尺</Text>
            <Switch
              onValueChange={async showScaleBar => {
                this.setState({ showScaleBar });
                await this.mapView.setShowScaleBar(showScaleBar);
                await this.mapView.refresh();
              }}
              value={this.state.showScaleBar}
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
