import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  DeviceEventEmitter,
  TouchableOpacity,
} from 'react-native';
import styles from '../styles';
import { MGMapView } from '@mapgis/mobile-react-native';
import { MAPX_FILE_PATH } from '../utils';

/**
 * @content 地图基本信息
 * @author xiaoying 2019-08-20 09:37
 */

export default class MapBaseInformation extends Component {
  static navigationOptions = { title: '地图基本信息' };

  constructor() {
    super();
    this.state = {
      mapInfo: new Map(),
    };
  }

  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.registerMapLoadListener();
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
    this.map = await this.mapView.getMap();
  };

  // 地图加载监听
  componentDidMount() {
    this.mapLoadListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.LoadMapListener_Finish',
      async res => {
        if (res.DidFinishLoadingMap) {
          // this.getMapInfo();
        }
      }
    );
  }

  componentWillUnmount() {
    this.mapLoadListener.remove();
  }

  // 读取地图信息
  getMapInfo = async () => {
    // 地图名称
    let mapName = await this.map.getName();

    // 地图显示范围
    let range = await this.map.getRange();
    let xMax = 0;
    let yMax = 0;
    let xMin = 0;
    let yMin = 0;
    if (range !== null) {
      xMax = await range.getXMax();
      yMax = await range.getYMax();
      xMin = await range.getXMin();
      yMin = await range.getYMin();
      xMax = xMax.toFixed(4); // 保留小数点后两位
      yMax = yMax.toFixed(4); // 保留小数点后两位
      xMin = xMin.toFixed(4); // 保留小数点后两位
      yMin = yMin.toFixed(4); // 保留小数点后两位
    }

    let sRefData = await this.map.getSRSInfo(); // 投影坐标系
    let sRefDataName = null; // 投影坐标系的名称
    if (sRefData !== null) {
      sRefDataName = await sRefData.getPCSName();
    }

    // 符号比
    let symbol = await this.map.getSymbolScale();

    let value = new Map();
    value.set('mapName', mapName);
    value.set('xMin', xMin);
    value.set('xMax', xMax);
    value.set('yMin', yMin);
    value.set('yMax', yMax);
    value.set('sRefDataName', sRefDataName);
    value.set('symbol', symbol);

    this.setState({ mapInfo: value });
  };
  render() {
    return (
      <View style={styles.container}>
        <MGMapView
          ref="mapView"
          onGetInstance={this.onGetInstance}
          style={styles.mapView}
        />
        <View style={style.itemView}>
          <View style={style.itemSingleView}>
            <Text style={style.itemKey}>地图名称:</Text>
            <Text style={style.itemValue}>
              {this.state.mapInfo.get('mapName')}
            </Text>
          </View>

          <Text style={style.itemKey}>范围：</Text>
          <View style={style.itemSingleView}>
            <Text style={style.itemKey}>xMin:</Text>
            <Text style={style.itemValue}>
              {this.state.mapInfo.get('xMin')}
            </Text>
          </View>

          <View style={style.itemSingleView}>
            <Text style={style.itemKey}>xMax:</Text>
            <Text style={style.itemValue}>
              {this.state.mapInfo.get('xMax')}
            </Text>
          </View>

          <View style={style.itemSingleView}>
            <Text style={style.itemKey}>yMin:</Text>
            <Text style={style.itemValue}>
              {this.state.mapInfo.get('yMin')}
            </Text>
          </View>

          <View style={style.itemSingleView}>
            <Text style={style.itemKey}>yMax:</Text>
            <Text style={style.itemValue}>
              {this.state.mapInfo.get('yMax')}
            </Text>
          </View>

          <Text style={style.itemKey}>投影坐标系:</Text>
          <Text style={style.itemValue}>
            {this.state.mapInfo.get('sRefDataName')}
          </Text>

          <View style={style.itemSingleView}>
            <Text style={style.itemKey}>符号比:</Text>
            <Text style={style.itemValue}>
              {this.state.mapInfo.get('symbol')}
            </Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.getMapInfo();
              }}
            >
              <Text style={styles.text}>查看地图基本信息</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  itemView: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    elevation: 4,
    backgroundColor: '#292c36',
    paddingLeft: 10,
    paddingRight: 10,
  },
  itemSingleView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#292c36',
  },
  // item的可见字体样式
  itemKey: {
    fontSize: 16,
    color: '#rgba(245,83,61,0.8)',
    flexDirection: 'column',
    textAlign: 'left',
    flexWrap: 'wrap',
    paddingTop: 5,
  },
  // item的可见字体样式
  itemValue: {
    fontSize: 16,
    color: '#fff',
    flexDirection: 'column',
    textAlign: 'left',
    flexWrap: 'wrap',
    paddingLeft: 5,
    paddingTop: 5,
  },
});
