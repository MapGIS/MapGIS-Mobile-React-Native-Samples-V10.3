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
  RangeTheme,
  RangeThemeInfo,
  PntInfo,
  RegInfo,
  GeomType,
  FeatureQuery,
} from '@mapgis/mobile-react-native';
import { WUHANAREA_FILE_PATH } from '../utils';

/**
 * @content 范围（分段）专题图示例
 * @author xiaoying 2019-11-27
 */

export default class RangeThemeDemo extends Component {
  static navigationOptions = { title: '范围（分段）专题图' };

  constructor() {
    super();
    this.state = {
      selectedLayerValue: '',
      selectedFieldNameValue: '名称',
      selectedFieldNumberValue: '1',
      pickerLayerData: [],
      pickerLayerFieldData: [],
      pickerFieldNumberData: [],
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
          this.initFieldNumber();
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
        data.push(layerName);
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
    this.setState({ selectedLayerValue: itemValue });
    // 改变图层下拉框同时，改变字段值
    this.initFieldNameData(itemValue);
    this.changeFieldNameValue('1', 0);
  };

  // 改变字段下拉框
  changeFieldNameValue = (itemValue, itemIndex) => {
    this.setState({
      selectedFieldNameValue: itemValue,
      selectedFieldNumberValue: '1',
    });
  };

  // 改变字段数下拉框
  changeFieldNumberValue = (itemValue, itemIndex) => {
    this.setState({ selectedFieldNumberValue: itemValue });
  };

  // 初始化字段下拉框数据
  initFieldNameData = async itemValue => {
    let filedNameArray = [];
    // 获取区图层的索引
    let layerIndex = await this.map.indexOfByName(itemValue);
    let selectedLayer = await this.map.getLayer(layerIndex);
    let fields = await selectedLayer.getFields();
    let fieldCount = await fields.getFieldCount();
    for (let i = 0; i < fieldCount; i++) {
      let field = await fields.getField(i);
      let fieldName = await field.getFieldName();
      filedNameArray.push(fieldName);
    }

    if (filedNameArray.length > 0) {
      // 由于单值专题图只对整数、字符串、日期型的数据有效，所以在此提前获取图层中可用的属性字段
      switch (layerIndex) {
        case 0:
          if (filedNameArray.length >= 7) {
            // 移除0--5的字段
            filedNameArray.splice(0, 6);
          }
          break;

        case 1:
          if (filedNameArray.length >= 7) {
            // 移除1--6的字段
            filedNameArray.splice(1, 6);
          }
          break;

        default:
          break;
      }
    }

    let selectFieldName = '名称';
    if (filedNameArray !== null && filedNameArray.length > 0) {
      selectFieldName = filedNameArray[0];
    }
    this.setState({
      selectFieldName: selectFieldName,
      pickerLayerFieldData: filedNameArray,
    });
  };

  // 初始化分段数
  initFieldNumber = () => {
    let fieldNumber = [];
    for (let i = 1; i <= 6; i++) {
      fieldNumber.push(i.toString());
    }

    this.setState({
      pickerFieldNumberData: fieldNumber,
      selectedFieldNumberValue: '1',
    });
  };

  // 创建范围专题图，首先查询数据
  createRangeTheme = async () => {
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
    // 先删除掉之前的专题
    let removeResult = this.removeRangeTheme();
    // 地图刷新完毕后，开始创建专题图
    if (removeResult) {
      // 开始创建专题图
      this.startCreateTheme(fieldValue);
    }
  };

  // 开始创建范围专题图
  startCreateTheme = async fieldValue => {
    let mapIndex = await this.map.indexOfByName(this.state.selectedLayerValue);
    let selectLayer = await this.map.getLayer(mapIndex);

    // 创建范围专题图对象
    let rangeThemeModule = new RangeTheme();
    let rangeTheme = await rangeThemeModule.createObj();
    await rangeTheme.setExpression(this.state.selectedFieldNameValue);
    await rangeTheme.setName(this.state.selectedLayerValue);
    await rangeTheme.setVisible(true);
    // 创建分段专题图绘制信息对象
    let rangThemeInfoModule = new RangeThemeInfo();
    let rangeThemeInfo = await rangThemeInfoModule.createObj();

    // 由于已知数据类型为浮点型，即将所有的属性值由String转换为float
    let fieldValue1 = [];
    for (let i = 0; i < fieldValue.length; i++) {
      let parseNumber = Number.parseFloat(fieldValue[i]);
      fieldValue1.push(parseNumber);
    }

    let selectedNumberValue = this.state.selectedFieldNumberValue;
    // 得到最大值、最小值、计算等距。当图层为行政区1，字段为人口数2017，最大值为：1054000，最小值为：298000
    let maxValue = Math.max.apply(null, fieldValue1);
    let minValue = Math.min.apply(null, fieldValue1);
    let count = Number.parseInt(selectedNumberValue, 10);
    let step = (maxValue - minValue) / count;

    let geomType = await selectLayer.GetGeometryType();
    switch (geomType) {
      case GeomType.GeomPnt:
        console.log('点要素');
        for (let i = 0; i < selectedNumberValue; i++) {
          let startValue = (minValue + i * step).toString();
          let endValue = (minValue + (i + 1) * step).toString();
          // 创建点几何图形信息对象
          let pntInfoModule = new PntInfo();
          let pntInfo = await pntInfoModule.createObj();
          // 设置角度
          await pntInfo.setAngle(0);
          // 设置符号库编号（请参考MapGIS符号库编号）
          await pntInfo.setLibID(1);
          let strSymId = (1 + Math.random() * (211 - 1 + 1)).toString();
          let intSymId = Number.parseInt(strSymId, 10);
          // 设置符号编号（请参考MapGIS符号库中符号编号）
          await pntInfo.setSymID(intSymId);

          // 设置可变颜色1（请参考MapGIS颜色库中颜色编号）
          await pntInfo.setOutClr1('rgba(255, 204, 204, 204)');
          // 设置符号高度
          await pntInfo.setHeight(1);
          // 设置符号宽度
          await pntInfo.setWidth(1);

          await rangeThemeInfo.setGeoInfo(pntInfo);
          await rangeThemeInfo.setCaption('第' + i + '个');
          await rangeThemeInfo.setStartValue(startValue);
          await rangeThemeInfo.setEndValue(endValue);
          await rangeThemeInfo.setIsVisible(true);
          await rangeTheme.append(rangeThemeInfo);
        }

        break;

      case GeomType.GeomLin:
        console.log('线要素');
        break;

      case GeomType.GeomReg:
        console.log('区要素');
        for (let j = 0; j < selectedNumberValue; j++) {
          let startValue = (minValue + j * step).toString();
          let endValue = (minValue + (j + 1) * step).toString();
          let regInfoModule = new RegInfo();
          let regInfo = await regInfoModule.createObj();

          await regInfo.setAngle(0);
          await regInfo.setOutPenW(1);
          await regInfo.setPatWidth(1);
          await regInfo.setPatHeight(1);
          await regInfo.setPatID(131);
          await regInfo.setFillClr('rgba(255, 10, 180, 180)');

          await rangeThemeInfo.setGeoInfo(regInfo);
          await rangeThemeInfo.setCaption('第' + j + '个');
          await rangeThemeInfo.setStartValue(startValue);
          await rangeThemeInfo.setEndValue(endValue);
          await rangeThemeInfo.setIsVisible(true);

          await rangeTheme.append(rangeThemeInfo);
        }
        break;

      default:
        break;
    }

    let themes = await selectLayer.getThemes();
    await themes.append(rangeTheme);
    await this.mapView.stopCurRequest();
    //刷新地图视图
    await this.mapView.forceRefresh();
  };

  // 删除范围专题图
  removeRangeTheme = async () => {
    let layerCount = await this.map.getLayerCount();

    for (let j = 0; j < layerCount; j++) {
      let mapLayer = await this.map.getLayer(j);
      let mapLayerType = await mapLayer.getClsType();
      if (mapLayerType === XClsType.SFCls) {
        let themes = await mapLayer.getThemes();
        if (themes !== null) {
          await themes.clear();
        }
      }
    }
    await this.mapView.forceRefresh();
    return true;
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

            <Picker
              style={style.pickerStyle}
              mode="dropdown"
              selectedValue={this.state.selectedFieldNumberValue}
              onValueChange={(itemValue, itemIndex) => {
                this.changeFieldNumberValue(itemValue, itemIndex);
              }}
            >
              {this.state.pickerFieldNumberData.map(item => (
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
                  this.createRangeTheme();
                }}
              >
                <Text style={styles.text}>创建专题图</Text>
              </TouchableOpacity>
            </View>
            <View style={style.button}>
              <TouchableOpacity
                onPress={() => {
                  this.removeRangeTheme();
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
    height: 30,
    backgroundColor: '#000',
    color: '#fff',
    marginRight: 30,
  },
  pickerItem: {
    backgroundColor: 'rgba(245,83,61,0.8)',
    color: '#fff',
    borderRadius: 15,
    flex: 1,
  },
  buttons: {
    width: Dimensions.get('window').width,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    marginTop: 30,
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
