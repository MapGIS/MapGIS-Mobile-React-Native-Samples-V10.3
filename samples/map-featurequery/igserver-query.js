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
  Dot,
} from '@mapgis/mobile-react-native';

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

    let serverLayerModule = new ServerLayer();
    let sLayer = await serverLayerModule.createObj();
    //为服务图层设置地图服务
    await sLayer.setMapServer(mapServer);
    await sLayer.setName('服务图层');

    let mapModule = new Map();
    let map = await mapModule.createObj();
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
    let getTotalFeatureCount = await featurePagedResult.getTotalFeatureCount();
    let graphicArry = [];
    let strFieldName = 'Name';
    let strFieldAddress = 'Address';
    this.graphicsOverlay = await this.mapView.getGraphicsOverlay();
    let featureLst = await featurePagedResult.getPage(1);
    for (let i = 0; i < featureLst.length; i++) {
      let feature = await featureLst[i];
      let attributes = await feature.getAttributes();
      let jsonObj = JSON.parse(attributes);
      let attrName = jsonObj[strFieldName];
      let attrAddr = jsonObj[strFieldAddress];
      this.setState({
        qryresult: this.state.qryresult.concat([{ name: attrName }]),
      });
      this.setState({
        qryresult: this.state.qryresult.concat([{ name: attrAddr }]),
      });

      let graphicList = await feature.toGraphics();
      for (let j = 0; j < graphicList.length; j++) {
        graphicArry.push(graphicList[j]);
      }
      //获取要素的几何信息（默认查询点要素）
      let fGeometry = await feature.getGeometry();
      let featureType = await fGeometry.getType();

      if (featureType === 2) {
        let dots3D = await fGeometry.getDots();
        let size = await dots3D.size();
        for (let k = 0; k < size; k++) {
          let dot3D = await dots3D.get(k);
          let dot3DX = await dot3D.getX();
          let dot3DY = await dot3D.getY();
          let dotMoudle = new Dot();
          let dot = await dotMoudle.createObj(dot3DX, dot3DY);
          let graphicTextModule = new GraphicText();
          this.graphicText = await graphicTextModule.createObj();
          await this.graphicText.setColor('rgba(0, 255, 255, 1)');
          await this.graphicText.setPoint(dot);
          await this.graphicText.setText(attrName);
          await this.graphicText.setFontSize(22);
          await this.graphicsOverlay.addGraphic(this.graphicText);
        }
      }
    }
    await this.graphicsOverlay.addGraphics(graphicArry);
    await this.mapView.refresh();
    ToastAndroid.show(
      '查询结果总数为：' + getTotalFeatureCount,
      ToastAndroid.SHORT
    );
  };

  //此处的item相当于listview中的一行中的一列的item,如果一列要显示几个信息在这个里面布局。(一行显示几个item，直接绑定每个item要显示的数据,构造的数据一个{}对应一个item--目前理解的每个item布局是一样)
  renderItem = ({ item }) => (
    <View style={style.item}>
      {<Text style={style.itemtxt}>{item.name}</Text>}
    </View>
  );

  _separator = () => {
    return (
      <View
        style={{
          height: 2,
          backgroundColor: 'gray',
        }}
      />
    );
  };

  _header = () => {
    return (
      <View style={style.itemHeader}>
        <Text style={[style.headtxt, { backgroundColor: 'gray' }]}>名称</Text>
        <Text style={[style.headtxt, { backgroundColor: 'gray' }]}>地址</Text>
      </View>
    );
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
        <FlatList
          style={style.resultView}
          ListHeaderComponent={this._header}
          data={this.state.qryresult}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this._separator}
          numColumns={2}
        />
      </View>
    );
  }
}
const style = StyleSheet.create({
  resultView: {
    marginTop: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  item: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    height: 20,
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
  itemtxt: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  headtxt: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'blue',
    fontSize: 12,
    flex: 1,
  },
});
