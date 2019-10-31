import React, { Component } from 'react';
import {
  View,
  ToastAndroid,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import styles from '../styles';
import { IGSERVER_BASE_URL } from '../utils';
import { IGSERVER_DOC_WUHAN_PATH } from '../utils';
import {
  Rect,
  MGMapView,
  FeatureQuery,
  ServerLayer,
  GraphicText,
  Map,
} from '@mapgis/mobile-react-native';

var attr = [];
/**
 * @content IGServer服务地图查询
 * @author  2019-10-25 下午2:52:36
 */
export default class MapIGServerQuery extends Component {
  static navigationOptions = { title: 'IGServer服务地图查询' };

  constructor() {
    super();
    this.state = {
      qryresult: [],
    };
  }

  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    //创建mapserver
    let mapServer = await ServerLayer.createMapServer('MapGISIGServerVector');
    //为mapserver设置URL地址
    await mapServer.setURL(IGSERVER_DOC_WUHAN_PATH);

    var serverLayerModule = new ServerLayer();
    var sLayer = await serverLayerModule.createObj();
    //为服务图层设置地图服务
    await sLayer.setMapServer(mapServer);
    await sLayer.setName('服务图层');

    var mapModule = new Map();
    var map = await mapModule.createObj();
    await map.append(sLayer);
    let isFinish = await this.mapView.setMapAsync(map);
    if (isFinish) {
      let R = new Rect();
      let mapRange = await R.createObj(
        12705276.572663,
        3542912.332349,
        12746062.17078,
        3607262.942711
      );
      await this.mapView.zoomToRange(mapRange, false);
    }
  };

  _featureQuery = async () => {
    let featureQuery = new FeatureQuery();
    let query = await featureQuery.createObjByIGSDoc(
      IGSERVER_BASE_URL,
      'WuHan',
      0,
      11
    );
    let condition = "Name like '%公园%'";
    await query.setWhereClause(condition);
    await query.setPageSize(100);
    let featurePagedResult = await query.query();

    let pagecount = await featurePagedResult.getPageCount();
    let getTotalFeatureCount = await featurePagedResult.getTotalFeatureCount();

    let graphicArry = [];
    let attrName = '';
    let attrAddr = '';
    let strFieldName = 'Name';
    let strFieldAddress = 'Address';
    let featureLst = await featurePagedResult.getPage(1);

    for (let i = 0; i < featureLst.length; i++) {
      let feature = await featureLst[i];
      let attributes = await feature.getAttributes();
      var jsonObj = JSON.parse(attributes);
      attrName = jsonObj[strFieldName];
      attrAddr = jsonObj[strFieldAddress];
      alert('attrName:' + attrName + '\nattrAddr' + attrAddr);
      //结果列表数组
      //let attr = [];
      //attr.push({name:attrName, value:attrAddr});
      //this.setState({qryresult:this.state.qryresult.push({name:attrName, value:attrAddr})});
      //this.setState({qryresult:this.state.qryresult.concat([{name:attrName, value:attrAddr}])});       // 上层必须构建闭合的区

      let graphicList = await feature.toGraphics();
      for (let j = 0; j < graphicList.length; j++) {
        graphicArry.push(graphicList[j]);
      }
      let graphicsOverlay = await this.mapView.getGraphicsOverlay();
      await graphicsOverlay.addGraphics(graphicArry);

      //获取要素的几何信息（默认查询点要素）
      let fGeometry = await feature.getGeometry();
      let featureType = await fGeometry.getType();

      if (featureType == 2) {
        let dots3D = await fGeometry.getDots();
        for (let k = 0; k < dots3D.length; k++) {
          let dot = await dots3D.get(k);
          let graphicTextModule = new GraphicText();
          let graphicText = await graphicTextModule.createObj();
          await graphicText.setColor('rgba(0, 255, 255, 1)');
          await graphicText.setPoint(dot);
          await graphicText.setText(attrName);
          await graphicText.setFontSize(22);
          let graphicsOverlay = await this.mapView.getGraphicsOverlay();
          await graphicsOverlay.addGraphic(graphicText);
        }
      }
    }
    await this.mapView.refresh();
    ToastAndroid.show(
      '查询结果总数为：' + getTotalFeatureCount,
      ToastAndroid.SHORT
    );
    console.log('pagecount:' + pagecount);
    console.log('getTotalFeatureCount:' + getTotalFeatureCount);
    console.log('featureLst:' + featureLst.length);
  };

  //item.item中第一个是变量,第二个item表示项
  renderItem = item => (
    <View style={style.item}>
      {<Text style={style.txt}>{item.item.name}</Text>}
      {<Text style={style.txt}>{item.item.value}</Text>}
    </View>
  );

  _separator = () => {
    return <View style={{ height: 2, backgroundColor: 'blue' }} />;
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
            <TouchableOpacity onPress={this._featureQuery}>
              <Text style={styles.text}>查询</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
const style = StyleSheet.create({
  resultView: {
    marginTop: 15,
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
  name: {
    marginLeft: 8,
    color: '#f5533d',
    fontSize: 12,
  },
  data: {
    color: '#eee',
    fontSize: 12,
  },
});
