import React, { Component } from 'react';
import styles from '../styles';
import {
  MGMapView,
  Environment,
  XClsType,
  MultiClassTheme,
  ClassItemType,
  ClassItemValue,
  RegInfo,
  GeomType,
} from '@mapgis/mobile-react-native';
import {
  WUHANAREA_FILE_PATH,
  SYSTEM_LIB_PATH1,
  SYSTEM_LIB_PATH2,
} from '../utils';

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
/**
 * @content 多表达式分段专题图示例
 * @author xiaoying 2019-11-27
 */

export default class MapSetSystemLibrary extends Component {
  static navigationOptions = { title: '多表达式分段专题图' };

  constructor() {
    super();
  }
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  componentWillUnmount() {
    // 恢复系统库为系统库1
    this.setSystemLibrary(SYSTEM_LIB_PATH1);
  }

  openMap = async () => {
    // 设置系统库2
    this.setSystemLibrary(SYSTEM_LIB_PATH2);
    await this.mapView.loadFromFile(WUHANAREA_FILE_PATH);
    this.map = await this.mapView.getMap();
  };

  // 设置系统库
  setSystemLibrary = async path => {
    let environmentModule = new Environment();
    let environment = await environmentModule.createObj();
    await environment.setSystemLibraryPath(path);
  };

  // 创建专题图
  createMultiClassTheme = async () => {
    // 删除原有专题图
    this.removeSimpleTheme();
    // 创建多表达式分段对象
    let multiClassThemeModule = new MultiClassTheme();
    let multiClassTheme = await multiClassThemeModule.createObj();
    await multiClassTheme.setName('行政区1');
    // 添加分级字段表达式
    await multiClassTheme.appendExpression(
      '人口数_2017',
      ClassItemType.RangeType
    );
    await multiClassTheme.appendExpression('GDP_2017', ClassItemType.RangeType);
    // 分段1
    // 创建分段值对象
    let classItemValueModule1 = new ClassItemValue();
    let classItemValue1 = await classItemValueModule1.createObj();
    // 设置统计分段类型，必须在设置起始值之前设置
    await classItemValue1.setType(ClassItemType.RangeType);
    let startValue1 = 298000;
    let endValue1 = 676000;
    // 开始值
    await classItemValue1.setStartValue(startValue1.toString());
    // 结束值
    await classItemValue1.setEndValue(endValue1.toString());
    // 添加字段表达式对应的分段值
    await multiClassTheme.appendSubItem('人口数_2017', classItemValue1);

    // 分段2
    let classItemValueModule2 = new ClassItemValue();
    let classItemValue2 = await classItemValueModule2.createObj();
    await classItemValue2.setType(ClassItemType.RangeType);
    let startValue2 = 676000;
    let endValue2 = 1054000;
    await classItemValue2.setStartValue(startValue2.toString());
    await classItemValue2.setEndValue(endValue2.toString());
    await multiClassTheme.appendSubItem('人口数_2017', classItemValue2);

    // 分段3
    let classItemValueModule3 = new ClassItemValue();
    let classItemValue3 = await classItemValueModule3.createObj();
    await classItemValue3.setType(ClassItemType.RangeType);
    let startValue3 = 395;
    let endValue3 = 772;
    await classItemValue3.setStartValue(startValue3.toString());
    await classItemValue3.setEndValue(endValue3.toString());
    await multiClassTheme.appendSubItem('GDP_2017', classItemValue3);

    // 分段4
    let classItemValueModule4 = new ClassItemValue();
    let classItemValue4 = await classItemValueModule4.createObj();
    await classItemValue4.setType(ClassItemType.RangeType);
    let startValue4 = 772;
    let endValue4 = 1150;
    await classItemValue4.setStartValue(startValue4.toString());
    await classItemValue4.setEndValue(endValue4.toString());
    await multiClassTheme.appendSubItem('GDP_2017', classItemValue4);

    // 生成所有的分段信息（该函数在调整了expression或者expression内部的分段信息后都需要调用）
    let result = await multiClassTheme.make(false);
    if (result) {
      let itemCount = await multiClassTheme.getItemCount();
      for (let i = 0; i < itemCount; i++) {
        // 返回指定项（做完笛卡尔积之后）的信息
        let multiClassThemeInfo = await multiClassTheme.getItem(i);
        // 构建区图形信息
        let regInfoModule = new RegInfo();
        let regInfo = await regInfoModule.createObj();
        // 设置填充颜色
        await regInfo.setFillClr('rgba(11, 55, 109, 22)');
        // 设置专题图项的图形信息
        await multiClassThemeInfo.setGeoInfo(regInfo, GeomType.GeomReg);
        // 设置专题图可见性
        await multiClassThemeInfo.setVisible(true);
      }
    }

    // 获取矢量图层
    let layerIndex = await this.map.indexOfByName('行政区1');
    if (layerIndex !== -1) {
      let mapLayer = await this.map.getLayer(layerIndex);
      // 将专题图添加到对应的矢量图层上
      let themes = await mapLayer.getThemes();
      await themes.append(multiClassTheme);

      await this.mapView.stopCurRequest();
      await this.mapView.forceRefresh();
    }
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

        <View style={styles.buttons}>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.createMultiClassTheme();
              }}
            >
              <Text style={styles.text}>创建专题图</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.removeSimpleTheme();
              }}
            >
              <Text style={styles.text}>删除专题图</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={style.textView}>
          <View style={style.itemSingleView}>
            <Text style={style.itemKey}>图层：</Text>
            <Text style={style.itemValue}>行政区1</Text>
          </View>

          <View style={style.itemSingleView}>
            <Text style={style.itemKey}>字段1：</Text>
            <Text style={style.itemValue}>人口数_2017</Text>
          </View>

          <View style={style.itemSingleView}>
            <Text style={style.itemKey}>第一段：</Text>
            <Text style={style.itemValue}>2998000-676000</Text>
          </View>

          <View style={style.itemSingleView}>
            <Text style={style.itemKey}>第二段：</Text>
            <Text style={style.itemValue}>676000-1054000</Text>
          </View>

          <View style={style.itemSingleView}>
            <Text style={style.itemKey}>字段2：</Text>
            <Text style={style.itemValue}>GDP_2017</Text>
          </View>

          <View style={style.itemSingleView}>
            <Text style={style.itemKey}>第一段：</Text>
            <Text style={style.itemValue}>395-772</Text>
          </View>
          <View style={style.itemSingleView}>
            <Text style={style.itemKey}>第二段：</Text>
            <Text style={style.itemValue}>772-1150</Text>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  textView: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  itemSingleView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#292c36',
  },
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
