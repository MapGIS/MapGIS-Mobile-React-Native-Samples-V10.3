/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
} from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import { MGMapView } from '@mapgis/mobile-react-native';
import { Switch } from '../common';

/**
 * @content 地图显示事件监听
 * @author fjl 2019-7-25 下午2:52:36
 */
export default class MapShowListen extends Component {
  static navigationOptions = { title: '地图显示事件监听' };

  constructor() {
    super();
    this.state = {
      TapListen: true,
      zoomChangeListen: true,
      angelChangeListen: false,
      centerchangelisten: false,
      animationchangelisten: false,
      refreshchangelisten: false,
      logs: [],
    };
  }

  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
    await this.mapView.registerZoomChangedListener();
  };

  componentWillUnmount = () => {
    this.mapLoadListener.remove();
  };

  componentDidMount() {
    this.mapLoadListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.zoomchanged_event',
      res => {
        this.setState({
          logs: [
            {
              Type: '级别变化监听',
              key: Math.random().toString(),
              time: new Date().toLocaleString(),
              data: JSON.stringify(res, null, 2),
            },
            ...this.state.logs,
          ],
        });
      }
    );

    DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.rotatechanged_event',
      res => {
        this.setState({
          logs: [
            {
              Type: '角度变化监听',
              key: Math.random().toString(),
              time: new Date().toLocaleString(),
              data: JSON.stringify(res, null, 2),
            },
            ...this.state.logs,
          ],
        });
      }
    );

    DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.centerchanged_event',
      res => {
        this.setState({
          logs: [
            {
              Type: '中心点改变监听',
              key: Math.random().toString(),
              time: new Date().toLocaleString(),
              data: JSON.stringify(res, null, 2),
            },
            ...this.state.logs,
          ],
        });
      }
    );

    DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.RefreshListener',
      res => {
        this.setState({
          logs: [
            {
              Type: '刷新事件监听',
              key: Math.random().toString(),
              time: new Date().toLocaleString(),
              data: JSON.stringify(res, null, 2),
            },
            ...this.state.logs,
          ],
        });
      }
    );

    DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.AnimationListener',
      res => {
        this.setState({
          logs: [
            {
              Type: '动画监听',
              key: Math.random().toString(),
              time: new Date().toLocaleString(),
              data: JSON.stringify(res, null, 2),
            },
            ...this.state.logs,
          ],
        });
      }
    );
  }

  _renderItem = ({ item }) => (
    <View style={styles.logItem}>
      <View style={styles.logItemHeader}>
        <Text style={styles.logLabel}>{item.Type}</Text>
        <Text style={styles.logTime}>{item.time}</Text>
        <Text style={styles.logLabel}>{item.event}</Text>
      </View>
      {item.data !== '{}' && <Text style={styles.logData}>{item.data}</Text>}
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.controls}>
          <View style={styles.control}>
            <Text style={styles.label}>级别变化</Text>
            <Switch
              onValueChange={async zoomChangeListen => {
                this.setState({ zoomChangeListen });
                if (zoomChangeListen === true) {
                  await this.mapView.registerZoomChangedListener();
                } else {
                  await this.mapView.unregisterZoomChangedListener();
                }
              }}
              value={this.state.zoomChangeListen}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>角度变化</Text>
            <Switch
              onValueChange={async angelChangeListen => {
                this.setState({ angelChangeListen });
                if (angelChangeListen === true) {
                  await this.mapView.registerRotateChangedListener();
                } else {
                  await this.mapView.unregisterRotateChangedListener();
                }
                await this.mapView.refresh();
              }}
              value={this.state.angelChangeListen}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>中心点变化</Text>
            <Switch
              onValueChange={async centerchangelisten => {
                this.setState({ centerchangelisten });
                if (centerchangelisten === true) {
                  await this.mapView.registerCenterChangedListener();
                } else {
                  await this.mapView.unregisterCenterChangedListener();
                }
                await this.mapView.refresh();
              }}
              value={this.state.centerchangelisten}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>动画监听</Text>
            <Switch
              onValueChange={async animationchangelisten => {
                this.setState({ animationchangelisten });
                if (animationchangelisten === true) {
                  await this.mapView.registerAnimationListener();
                } else {
                  await this.mapView.unregisterAnimationListener();
                }
                await this.mapView.refresh();
              }}
              value={this.state.animationchangelisten}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>刷新监听</Text>
            <Switch
              onValueChange={async refreshchangelisten => {
                this.setState({ refreshchangelisten });
                if (refreshchangelisten === true) {
                  await this.mapView.registerRefreshListener();
                } else {
                  await this.mapView.unregisterRefreshListener();
                }
                await this.mapView.refresh();
              }}
              value={this.state.refreshchangelisten}
            />
          </View>
        </View>
        <MGMapView
          ref="mapView"
          onGetInstance={this.onGetInstance}
          style={styles.mapView}
        />
        <FlatList
          style={styles.logs}
          data={this.state.logs}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}
