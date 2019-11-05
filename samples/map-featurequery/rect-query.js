import React, { Component } from 'react';
import {
  View,
  ToastAndroid,
  TouchableOpacity,
  Text,
  DeviceEventEmitter,
} from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import {
  Rect,
  MGMapView,
  Dot,
  QueryBound,
  FeatureQuery,
  GraphicPolygon,
} from '@mapgis/mobile-react-native';

/**
 * @content 矩形查询
 * @author fjl 2019-7-25 下午2:52:36
 */
export default class MapRectQuery extends Component {
  static navigationOptions = { title: '矩形查询' };

  constructor() {
    super();
    this.state = {
      qryRect: null,
    };
  }

  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.registerMapLoadListener();
    await this.mapView.loadFromFile(MAPX_FILE_PATH);

    let rectModule = new Rect();
    let rc = await rectModule.createObj(12730000, 3550000, 12760000, 3580000);
    this.setState({ qryRect: rc });

    let dotModule = new Dot();
    let dotArray = [];
    let dot1 = await dotModule.createObj(12730000, 3550000);
    let dot2 = await dotModule.createObj(12730000, 3580000);
    let dot3 = await dotModule.createObj(12760000, 3580000);
    let dot4 = await dotModule.createObj(12760000, 3550000);
    dotArray.push(dot1);
    dotArray.push(dot2);
    dotArray.push(dot3);
    dotArray.push(dot4);
    dotArray.push(dot1);
    let graphicPolygonModule = new GraphicPolygon();
    this.graphicPolygon = await graphicPolygonModule.createObj();
    await this.graphicPolygon.setColor('rgba(50, 50, 50, 50)');
    await this.graphicPolygon.setBorderlineColor('rgba(20, 255, 0, 10)');
    await this.graphicPolygon.setPointSize(10);
    await this.graphicPolygon.setPoints(dotArray, null);

    this.graphicsOverlay = await this.mapView.getGraphicsOverlay();
    await this.graphicsOverlay.addGraphic(this.graphicPolygon);
    await this.mapView.refresh();
  };

  componentDidMount() {
    DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.LoadMapListener_Finish',
      async res => {
        if (res.DidFinishLoadingMap) {
          let R = new Rect();
          let mapRange = await R.createObj(
            12716197.61,
            3522206.2847,
            12772863.4857,
            3611612.4442
          );
          await this.mapView.zoomToRange(mapRange, true);
        }
      }
    );
  }

  _featureQuery = async () => {
    let qu = new QueryBound();
    let queryBound = await qu.createObjByRect(this.state.qryRect);

    let map = await this.mapView.getMap();
    let vectorLayer = null;
    //获取查询图层对象（指定区图层）
    for (let i = 0; i < (await map.getLayerCount()); i++) {
      let mapLayer = await map.getLayer(i);
      if ((await mapLayer.getName()) === '水域') {
        vectorLayer = mapLayer;
        break;
      }
    }
    if (vectorLayer != null) {
      let featureQuery = new FeatureQuery();
      let query = await featureQuery.createObjByVectorLayer(vectorLayer);
      await query.setPageSize(10000);
      await query.setSpatialFilterRelationship(1);
      await query.setQueryBound(queryBound);
      let featurePagedResult = await query.query();
      let getTotalFeatureCount = await featurePagedResult.getTotalFeatureCount();
      let graphicArry = [];
      let featureLst = await featurePagedResult.getPage(1);
      for (let i = 0; i < featureLst.length; i++) {
        let feature = await featureLst[i];
        let graphicList = await feature.toGraphics();
        for (let j = 0; j < graphicList.length; j++) {
          graphicArry.push(graphicList[j]);
        }
      }
      this.graphicsOverlay = await this.mapView.getGraphicsOverlay();
      await this.graphicsOverlay.addGraphics(graphicArry);
      await this.mapView.refresh();
      ToastAndroid.show(
        '查询结果总数为：' + getTotalFeatureCount,
        ToastAndroid.SHORT
      );
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
            <TouchableOpacity onPress={this._featureQuery}>
              <Text style={styles.text}>矩形查询</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
