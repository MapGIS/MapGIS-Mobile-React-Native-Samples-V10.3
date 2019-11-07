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
import {
  MGMapView,
  SketchEditor,
  SketchDataType,
  MeasureType,
  CoordinateType,
  CoordinateConvert,
  CoordinateConvertParameter,
} from '@mapgis/mobile-react-native';
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
      SketchEditorListener: false,
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
    // await this.mapView.registerDoubleTapListener();
    // await this.mapView.registerLongTapListener();
    // await this.mapView.registerTouchListener();
    console.log('openMap:' + 'openMap');
    let sketchEditor = new SketchEditor();
    let sket1 = await sketchEditor.createObj(this.mapView);
    this.sket = sket1;
  };

  componentDidMount() {
    DeviceEventEmitter.addListener(
      'com.mapgis.RN.SketchEditor.geometry_changed',
      async e => {}
    );
    DeviceEventEmitter.addListener(
      'com.mapgis.RN.SketchEditor.vertex_selected',
      async e => {}
    );
    DeviceEventEmitter.addListener(
      'com.mapgis.RN.SketchEditor.undo_state_changed',
      async e => {
        alert(e.undoResult);
      }
    );
    DeviceEventEmitter.addListener(
      'com.mapgis.RN.SketchEditor.redo_state_changed',
      async e => {
        alert(e.redoResult);
      }
    );

    DeviceEventEmitter.addListener(
      'com.mapgis.RN.SketchEditor.sketch_state_changed',
      res0 => {
        this.setState({
          // logs: [
          //     {
          //         Type:"sketch_state_changed",
          //         key: Math.random().toString(),
          //         time: new Date().toLocaleString(),
          //         data: JSON.stringify(res0, null, 2)
          //     },
          //     // ...this.state.logs
          // ]
        });
      },
      res1 => {
        alert(res1);
      },
      res2 => {
        this.setState({
          // logs: [
          //     {
          //         Type:"sketch_state_changed2",
          //         key: Math.random().toString(),
          //         time: new Date().toLocaleString(),
          //         data: JSON.stringify(res2, null, 2)
          //     },
          // ...this.state.logs
          // ]
        });
      },
      res3 => {
        alert(res3);
        this.setState({
          logs: [
            {
              Type: 'sketch_state_changed3',
              key: Math.random().toString(),
              time: new Date().toLocaleString(),
              data: JSON.stringify(res3, null, 1),
            },
            // ...this.state.logs
          ],
        });
      }
    );
    DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.single_tap_event',
      res => {
        this.setState({
          logs: [
            {
              Type: '单击事件监听',
              key: Math.random().toString(),
              time: new Date().toLocaleString(),
              data: JSON.stringify(res, null, 2),
            },
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
            // ...this.state.logs
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
        ],
      });
    });
  }

  logger(event) {
    return data => {
      this.setState({
        logs: [
          {
            event,
            key: Math.random().toString(),
            time: new Date().toLocaleString(),
            data: JSON.stringify(data, null, 2),
          },
          ...this.state.logs,
        ],
      });
    };
  }

  renderItem = ({ item }) => (
    <View style={style.item}>
      <View style={style.itemHeader}>
        <Text style={style.label}>{item.Type}</Text>
        <Text style={style.time}>{item.time}</Text>
        <Text style={style.label}>{item.event}</Text>
      </View>
      {item.data !== '{}' && <Text style={style.data}>{item.data}</Text>}
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
                if (TapListen == true) {
                  await this.mapView.registerTapListener();
                  console.log('TapListen:' + TapListen);
                } else {
                  console.log('TapListen:' + TapListen);
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
                if (LongTapListen == true) {
                  // await this.mapView.registerLongTapListener();
                  // alert("SketchDataType"+"\n Point："+ SketchDataType.POINT +"\n MULTIPOINT："+SketchDataType.MULTIPOINT
                  // +"\n POLYLINE:"+SketchDataType.POLYLINE +"\n POLYGON:"+SketchDataType.POLYGON
                  // +"\n FREEHAND_LINE:"+SketchDataType.FREEHAND_LINE+"\n FREEHAND_POLYGON:"+SketchDataType.FREEHAND_POLYGON);

                  // alert("MeasureType"+"\n PLANAR:"+MeasureType.PLANAR+"\n GEODETIC:"+MeasureType.GEODETIC);

                  // alert("coordinateType"+"\n BAIDU_LngLat:"+CoordinateType.BAIDU_LngLat+"\n GPS_LngLat:"+CoordinateType.GPS_LngLat
                  // +"\n AMAP_LngLat:"+CoordinateType.AMAP_LngLat+"\n NAVINFO_LngLat:"+CoordinateType.NAVINFO_LngLat
                  // +"\n GCJ02_LngLat:"+CoordinateType.GCJ02_LngLat);

                  await this.sket.start(SketchDataType.POINT);
                  // alert(redo);
                } else {
                  // await this.mapView.removeLongTapListener();
                  await this.sket.stop();
                }
              }}
              value={this.state.LongTapListen}
            />
          </View>

          <View style={styles.control}>
            <Text style={styles.label}>草图监听</Text>
            <Switch
              onValueChange={async SketchEditorListener => {
                this.setState({ SketchEditorListener });
                if (SketchEditorListener == true) {
                  await this.sket.addStateChangedListener();
                } else {
                  await this.sket.removeStateChangedListener();
                }
              }}
              value={this.state.SketchEditorListener}
            />
          </View>

          <View style={styles.control}>
            <Text style={styles.label}>双击监听</Text>
            <Switch
              onValueChange={async DoubleTapListen => {
                this.setState({ DoubleTapListen });

                if (DoubleTapListen == true) {
                  // await this.mapView.registerDoubleTapListener();
                  let redo = await this.sket.redo();
                } else {
                  // await this.mapView.unregisterDoubleTapListener();
                  // DeviceEventEmitter.removeListener("com.mapgis.RN.Mapview.double_tap_event",(res) => {});
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

                if (TouchTapListen == true) {
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
          style={style.logs}
          data={this.state.logs}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    position: 'absolute',
    justifyContent: 'space-between',
  },
  full: {
    flex: 1,
  },
  logs: {
    flex: 1,
    height: 12,
    elevation: 8,
    backgroundColor: '#292c36',
    // backgroundColor: "rgba(41, 44, 54, 0.5)",
  },
  item: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
  },
  time: {
    color: '#757575',
    fontSize: 12,
  },
  label: {
    marginLeft: 8,
    color: '#f5533d',
    fontSize: 12,
  },
  data: {
    color: '#eee',
    fontSize: 12,
  },
});
