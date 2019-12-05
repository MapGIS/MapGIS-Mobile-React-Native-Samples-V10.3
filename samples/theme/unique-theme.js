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
  UniqueTheme,
  UniqueThemeInfo,
  PntInfo,
  RegInfo,
  GeomType,
  FeatureQuery,
} from '@mapgis/mobile-react-native';
import { WUHANAREA_FILE_PATH } from '../utils';

/**
 * @content 单值（唯一值）专题图示例
 * @author xiaoying 2019-11-27
 */

export default class UniqueThemeDemo extends Component {
  static navigationOptions = { title: '单值（唯一值）专题图' };

  constructor() {
    super();
    this.state = {
      selectedLayerValue: '',
      selectedFieldNameValue: '名称',
      pickerLayerData: [],
      pickerLayerFieldData: [],
    };
  }
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  componentDidMount() {
    this.loadMapListener = DeviceEventEmitter.addListener(
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

  componentWillUnmount() {
    this.loadMapListener.remove();
  }

  openMap = async () => {
    await this.mapView.registerMapLoadListener();
    await this.mapView.loadFromFile(WUHANAREA_FILE_PATH);
  };

  // 初始化图层下拉框数据
  initLayerData = async () => {
    let selectedLayerValue = '';
    this.map = await this.mapView.getMap();
    if (this.map != null) {
      let data = [];
      let count = await this.map.getLayerCount();
      for (let i = 0; i < count; i++) {
        let layer = await this.map.getLayer(i);
        let layerName = await layer.getName();
        // 只获取区图层
        let geomType = await layer.GetGeometryType();
        if (geomType === GeomType.GeomReg) {
          data.push(layerName);
        }
      }
      let size = data.length;
      if (size > 0) {
        selectedLayerValue = data[0];
      }
      this.setState({
        selectedLayerValue: selectedLayerValue,
        pickerLayerData: data,
      });
      // 初始化字段数据
      this.initFieldNameData(selectedLayerValue);
    }
  };

  // 改变图层下拉框
  changeLayerValue = (itemValue, itemIndex) => {
    // 改变图层下拉框同时，改变字段值
    this.initFieldNameData(itemValue);
    this.setState({ selectedLayerValue: itemValue });
  };

  // 改变字段下拉框
  changeFieldNameValue = (itemValue, itemIndex) => {
    this.setState({ selectedFieldNameValue: itemValue });
  };

  // 初始化字段下拉框数据
  initFieldNameData = async itemValue => {
    let filedNameArray = [];
    // 获取区图层的索引
    let layerIndex = await this.map.indexOfByName(itemValue);
    // 由于单值专题图只对整数、字符串、日期型的数据有效，所以在此提前获取图层中可用的属性字段
    switch (layerIndex) {
      case 0:
        filedNameArray.push('名称');
        filedNameArray.push('ID');
        filedNameArray.push('人口数_2017');
        filedNameArray.push('房价_2017');
        filedNameArray.push('GDP_2017');
        break;

      case 1:
        filedNameArray.push('名称');
        filedNameArray.push('ID');
        filedNameArray.push('城区');
        break;

      default:
        break;
    }

    let selectFieldName = '名称';
    if (filedNameArray !== null && filedNameArray.length > 0) {
      selectFieldName = filedNameArray[0];
    }
    this.setState({
      selectedFieldNameValue: selectFieldName,
      pickerLayerFieldData: filedNameArray,
    });
  };

  // 创建单值专题图，首先查询数据
  createUniqueTheme = async () => {
    await this.mapView.stopCurRequest();
    // 获取选中的矢量图层
    let layerIndex = await this.map.indexOfByName(
      this.state.selectedLayerValue
    );

    let selectedLayer = await this.map.getLayer(layerIndex);

    // 创建地图查询对象
    let featureQueryModule = new FeatureQuery();
    let featureQuery = await featureQueryModule.createObjByVectorLayer(
      selectedLayer
    );

    // 设置每页结果数据，缺省为10条
    await featureQuery.setPageSize(20);
    // 设置属性查询条件
    await featureQuery.setWhereClause(null);
    // 执行查询
    let featurePagedResult = await featureQuery.query();
    let fieldValue = [];
    // 获取所有要素
    let pageCount = await featurePagedResult.getPageCount();
    for (let i = 1; i <= pageCount; i++) {
      let featureList = await featurePagedResult.getPage(i);
      for (let j = 0; j < featureList.length; j++) {
        let feature = featureList[j];
        let featureAttribute = await feature.getAttributes();
        let attributeArray = JSON.parse(featureAttribute);
        fieldValue.push(attributeArray[this.state.selectedFieldNameValue]);
      }
    }

    // 开始创建专题图
    this.startCreateTheme(fieldValue);
  };

  // 创建简单专题图
  startCreateTheme = async fieldValue => {
    this.removeUniqueTheme();
    let mapIndex = await this.map.indexOfByName(this.state.selectedLayerValue);
    let selectLayer = await this.map.getLayer(mapIndex);

    // 创建单值专题图
    let uniqueThemeModule = new UniqueTheme();
    let uniqueTheme = await uniqueThemeModule.createObj();
    await uniqueTheme.setName(this.state.selectedLayerValue);
    await uniqueTheme.setExpression(this.state.selectedFieldNameValue);
    await uniqueTheme.setVisible(true);

    // 创建单值专题图绘制信息对象
    let uniqueThemeInfoModule = new UniqueThemeInfo();
    let uniqueThemeInfo = await uniqueThemeInfoModule.createObj();
    await uniqueThemeInfo.setIsVisible(true);
    await uniqueThemeInfo.setMaxScale(0);
    await uniqueThemeInfo.setMinScale(0);

    let fieldValueLength = fieldValue.length;
    let geomType = await selectLayer.GetGeometryType();
    switch (geomType) {
      case GeomType.GeomPnt:
        console.log('点要素');
        for (let i = 0; i < fieldValueLength; i++) {
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

          await uniqueThemeInfo.setGeoInfo(pntInfo);
          await uniqueThemeInfo.setCaption('第' + i + '个');
          await uniqueThemeInfo.setValue(fieldValue[i]);
          await uniqueTheme.append(uniqueThemeInfo);
        }

        break;

      case GeomType.GeomLin:
        console.log('线要素');
        break;

      case GeomType.GeomReg:
        console.log('区要素');
        for (let j = 0; j < fieldValueLength; j++) {
          let regInfoModule = new RegInfo();
          let regInfo = await regInfoModule.createObj();
          //设置填充颜色（请参考MapGIS颜色库中颜色编号）
          await regInfo.setFillClr(1 + Math.random() * (1500 - 1 + 1));

          await uniqueThemeInfo.setGeoInfo(regInfo);
          await uniqueThemeInfo.setCaption('第' + j + '个');
          await uniqueThemeInfo.setValue(fieldValue[j]);
          await uniqueTheme.append(uniqueThemeInfo);
        }
        break;

      default:
        break;
    }

    let themes = await selectLayer.getThemes();
    await themes.append(uniqueTheme);

    await this.mapView.stopCurRequest();
    //刷新地图视图
    await this.mapView.forceRefresh();
  };

  // 删除单一专题图
  removeUniqueTheme = async () => {
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
          <View style={style.pickerGroup}>
            <Picker
              style={style.pickerStyle}
              mode="dropdown"
              selectedValue={this.state.selectedLayerValue}
              onValueChange={(itemValue, itemIndex) => {
                this.changeLayerValue(itemValue, itemIndex);
              }}
            >
              {this.state.pickerLayerData.map(item => (
                <Picker.Item
                  key={item}
                  value={item}
                  label={item}
                  itemStyle={style.pickerItem}
                />
              ))}
            </Picker>
            <Picker
              style={style.pickerStyle}
              mode="dropdown"
              selectedValue={this.state.selectedFieldNameValue}
              onValueChange={(itemValue, itemIndex) => {
                this.changeFieldNameValue(itemValue, itemIndex);
              }}
            >
              {this.state.pickerLayerFieldData.map(item => (
                <Picker.Item
                  key={item}
                  value={item}
                  label={item}
                  itemStyle={style.pickerItem}
                />
              ))}
            </Picker>
          </View>

          <View style={style.buttons}>
            <View style={style.button}>
              <TouchableOpacity
                onPress={() => {
                  this.createUniqueTheme();
                }}
              >
                <Text style={styles.text}>创建专题图</Text>
              </TouchableOpacity>
            </View>
            <View style={style.button}>
              <TouchableOpacity
                onPress={() => {
                  this.removeUniqueTheme();
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
  pickerGroup: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  pickerStyle: {
    width: 130,
    height: 35,
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
    marginTop: 20,
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
