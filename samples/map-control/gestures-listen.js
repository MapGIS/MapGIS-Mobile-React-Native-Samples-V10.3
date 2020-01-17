/* eslint-disable no-unused-vars */
/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-27 14:10:45
 * @LastEditTime: 2019-09-19 10:10:00
 * @LastEditors: Please set LastEditors
 */
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
 * @content 地图手势事件监听
 * @author fjl 2019-7-25 下午2:52:36
 */
export default class MapGesturesListen extends Component {
  static navigationOptions = { title: '地图手势事件监听' };

  constructor() {
    super();
    this.state = {
      TapListen: true,
      DoubleTapListen: false,
      LongTapListen: false,
      TouchTapListen: false,
      logs: [],
    };
  }

  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
    await this.mapView.registerTapListener();
  };

  componentWillUnmount = () => {
    this.mapLoadListener.remove();
  };

  componentDidMount() {
    this.mapLoadListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.single_tap_event',
      res => {
        this.setState({
          logs: [
            {
              Type: '短按事件监听',
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
      'com.mapgis.RN.Mapview.double_tap_event',
      res => {
        this.setState({
          logs: [
            {
              Type: '双击事件监听',
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
      'com.mapgis.RN.Mapview.long_tap_event',
      res => {
        this.setState({
          logs: [
            {
              Type: '长按事件监听',
              key: Math.random().toString(),
              time: new Date().toLocaleString(),
              data: JSON.stringify(res, null, 2),
            },
            ...this.state.logs,
          ],
        });
      }
    );

    DeviceEventEmitter.addListener('com.mapgis.RN.Mapview.touch_event', res => {
      this.setState({
        logs: [
          {
            Type: '触摸事件监听',
            key: Math.random().toString(),
            time: new Date().toLocaleString(),
            data: JSON.stringify(res, null, 2),
          },
          ...this.state.logs,
        ],
      });
    });
  }

  renderItem = ({ item }) => (
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
            <Text style={styles.label}>短按监听</Text>
            <Switch
              onValueChange={async TapListen => {
                this.setState({ TapListen });
                if (TapListen === true) {
                  await this.mapView.registerTapListener();
                } else {
                  await this.mapView.unregisterTapListener();
                }
              }}
              value={this.state.TapListen}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>长按监听</Text>
            <Switch
              onValueChange={async LongTapListen => {
                this.setState({ LongTapListen });
                if (LongTapListen === true) {
                  await this.mapView.registerLongTapListener();
                } else {
                  await this.mapView.removeLongTapListener();
                }
              }}
              value={this.state.LongTapListen}
            />
          </View>

          <View style={styles.control}>
            <Text style={styles.label}>双击监听</Text>
            <Switch
              onValueChange={async DoubleTapListen => {
                this.setState({ DoubleTapListen });

                if (DoubleTapListen === true) {
                  await this.mapView.registerDoubleTapListener();
                } else {
                  await this.mapView.unregisterDoubleTapListener();
                }
              }}
              value={this.state.DoubleTapListen}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>触摸监听</Text>
            <Switch
              onValueChange={async TouchTapListen => {
                this.setState({ TouchTapListen });

                if (TouchTapListen === true) {
                  console.log('TouchTapListen:' + TouchTapListen);
                  await this.mapView.registerTouchListener();
                } else {
                  console.log('TouchTapListen:' + TouchTapListen);
                  await this.mapView.unregisterTouchListener();
                }
              }}
              value={this.state.TouchTapListen}
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
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
