import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  DeviceEventEmitter,
  ToastAndroid,
  Picker,
  StyleSheet,
  Dimensions,
} from 'react-native';
import styles from '../styles';
import {
  MGMapView,
  XClsType,
  ThemeInfo,
  PntInfo,
  RegInfo,
  SimpleTheme,
  GeomType,
} from '@mapgis/mobile-react-native';
import { WUHANAREA_FILE_PATH } from '../utils';

/**
 * @content 简单（统一）专题图示例
 * @author xiaoying 2019-11-26
 */

export default class SimpleThemeDemo extends Component {
  static navigationOptions = { title: '简单（统一）专题图' };

  constructor() {
    super();
    this.state = {
      selectedValue: '',
      pickerData: [],
    };
  }
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  componentDidMount() {
    DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.LoadMapListener_Finish',
      async res => {
        if (res.DidFinishLoadingMap) {
          ToastAndroid.show('地图加载完成', ToastAndroid.SHORT);
          this.initLayerData();
        } else {
          ToastAndroid.show('地图加载失败', ToastAndroid.SHORT);
        }
      }
    );
  }

  openMap = async () => {
    await this.mapView.registerMapLoadListener();
    await this.mapView.loadFromFile(WUHANAREA_FILE_PATH);
  };

  initLayerData = async () => {
    let selectedValue = '';
    this.map = await this.mapView.getMap();
    if (this.map != null) {
      let data = [];
      let count = await this.map.getLayerCount();
      for (let i = 0; i < count; i++) {
        let layer = await this.map.getLayer(i);
        let layerName = await layer.getName();
        data.push(layerName);
      }
      let size = data.length;
      if (size > 0) {
        selectedValue = data[0];
      }
      this.setState({ selectedValue: selectedValue, pickerData: data });
    }
  };

  changePickerValue = (itemValue, itemIndex) => {
    this.setState({ selectedValue: itemValue });
  };

  // 创建简单专题图
  createSimpleTheme = async () => {
    this.removeSimpleTheme();
    let themeInfoModule = new ThemeInfo();
    let themeInfo = await themeInfoModule.createObj();
    let mapIndex = await this.map.indexOfByName(this.state.selectedValue);
    let selectLayer = await this.map.getLayer(mapIndex);
    let geomType = await selectLayer.GetGeometryType();
    switch (geomType) {
      case GeomType.GeomPnt:
        ToastAndroid.show('点要素', ToastAndroid.SHORT);
        // 创建点几何图形信息对象
        let pntInfoModule = new PntInfo();
        let pntInfo = await pntInfoModule.createObj();
        // 设置角度
        await pntInfo.setAngle(0);
        // 设置符号库编号（请参考MapGIS符号库编号）
        await pntInfo.setLibID(1);
        // 设置符号编号（请参考MapGIS符号库中符号编号）
        await pntInfo.setSymID(1 + Math.random() * (211 - 1 + 1));
        // 设置可变颜色1（请参考MapGIS颜色库中颜色编号）
        await pntInfo.setOutClr1(1 + Math.random() * (1500 - 1 + 1));
        // 设置符号高度
        await pntInfo.setHeight(4);
        // 设置符号宽度
        await pntInfo.setWidth(4);
        //为专题图绘制信息对象设置图形信息
        await themeInfo.setGeoInfo(pntInfo);
        break;

      case GeomType.GeomLin:
        ToastAndroid.show('线要素', ToastAndroid.SHORT);
        break;

      case GeomType.GeomReg:
        ToastAndroid.show('区要素', ToastAndroid.SHORT);
        let regInfoModule = new RegInfo();
        let regInfo = await regInfoModule.createObj();
        //设置角度
        await regInfo.setAngle(0);
        //设置填充颜色（请参考MapGIS颜色库中颜色编号）

        await regInfo.setFillClr(1 + Math.random() * (1500 - 1 + 1));
        //设置填充模式
        await regInfo.setFillMode(0);
        //为专题图绘制信息对象设置图形信息
        await themeInfo.setGeoInfo(regInfo);
        break;

      default:
        break;
    }

    //设置名称
    await themeInfo.setCaption('简单专题图');
    //设置是否显示
    await themeInfo.setIsVisible(true);
    //设置最大显示比
    await themeInfo.setMaxScale(0);
    //设置最小显示比
    await themeInfo.setMinScale(0);
    //创建简单专题图对象
    let simpleThemeModule = new SimpleTheme();
    let simpleTheme = await simpleThemeModule.createObj();
    //设置专题图的名称
    await simpleTheme.setName('专题图');
    //设置专题图的可见性
    await simpleTheme.setVisible(true);
    //设置简单专题图的绘制信息
    await simpleTheme.setThemeInfo(themeInfo);
    // 将专题图添加到对应矢量图层上
    let themes = await selectLayer.getThemes();
    await themes.append(simpleTheme);

    //刷新地图视图
    await this.mapView.forceRefresh();
  };

  // 删除简单专题图
  removeSimpleTheme = async () => {
    let layerCount = await this.map.getLayerCount();

    for (let j = 0; j < layerCount; j++) {
      let mapLayer = await this.map.getLayer(j);
      let mapLayerType = await mapLayer.getClsType();
      if (mapLayerType === XClsType.SFCls) {
        let themes = await mapLayer.getThemes();
        if (themes !== null) {
          await themes.clear();
          await this.mapView.forceRefresh();
        }
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <MGMapView
          ref="mapView"
          onGetInstance={this.onGetInstance}
          style={styles.mapView}
        />
        <View style={style.pickerView}>
          <Picker
            style={style.pickerStyle}
            mode="dropdown"
            selectedValue={this.state.selectedValue}
            onValueChange={(itemValue, itemIndex) => {
              this.changePickerValue(itemValue, itemIndex);
            }}
          >
            {this.state.pickerData.map(item => (
              <Picker.Item
                key={item}
                value={item}
                label={item}
                itemStyle={style.pickerItem}
              />
            ))}
          </Picker>

          <View style={style.buttons}>
            <View style={style.button}>
              <TouchableOpacity
                onPress={() => {
                  this.createSimpleTheme();
                }}
              >
                <Text style={styles.text}>创建专题图</Text>
              </TouchableOpacity>
            </View>
            <View style={style.button}>
              <TouchableOpacity
                onPress={() => {
                  this.removeSimpleTheme();
                }}
              >
                <Text style={styles.text}>删除专题图</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  pickerView: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingTop: 5,
    paddingBottom: 5,
  },
  pickerStyle: {
    width: 125,
    height: 40,
    backgroundColor: '#000',
    color: '#fff',
    marginRight: 30,
  },
  pickerItem: {
    backgroundColor: 'rgba(245,83,61,0.8)',
    color: '#fff',
    borderRadius: 15,
  },
  buttons: {
    width: Dimensions.get('window').width,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  button: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    marginRight: 5,
    borderRadius: 30,
    backgroundColor: 'rgba(245,83,61,0.8)',
  },
});
