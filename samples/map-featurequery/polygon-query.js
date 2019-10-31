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
  PointF,
  QueryBound,
  FeatureQuery,
  GraphicPolygon,
} from '@mapgis/mobile-react-native';

/**
 * @content 多边形查询
 * @author  2019-10-25 下午2:52:36
 */
export default class MapPolygonQuery extends Component {
  static navigationOptions = { title: '多边形查询' };

  constructor() {
    super();
    this.state = {
      points: [],
    };
  }

  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.registerMapLoadListener();
    await this.mapView.loadFromFile(MAPX_FILE_PATH);

    let dotModule = new Dot();
    let dotArray = [];

    let dot0 = await dotModule.createObj(12725970, 3590399);
    let dot1 = await dotModule.createObj(12720256, 3581161);
    let dot2 = await dotModule.createObj(12722050, 3575104);
    let dot3 = await dotModule.createObj(12736232, 3577852);
    let dot4 = await dotModule.createObj(12736260, 3579983);

    dotArray.push(dot0);
    dotArray.push(dot1);
    dotArray.push(dot2);
    dotArray.push(dot3);
    dotArray.push(dot4);
    dotArray.push(dot0);

    this.setState({ points: dotArray });

    let graphicPolygonModule = new GraphicPolygon();
    let graphicPolygon = await graphicPolygonModule.createObj();

    await graphicPolygon.setColor('rgba(0, 0, 0, 180)');
    await graphicPolygon.setBorderlineColor('rgba(100, 200, 0, 90)');
    await graphicPolygon.setBorderlineWidth(12);
    await graphicPolygon.setPoints(dotArray, null);

    let graphicsOverlay = await this.mapView.getGraphicsOverlay();
    await graphicsOverlay.addGraphic(graphicPolygon);

    await this.mapView.refresh();
  };

  componentDidMount() {
    DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.LoadMapListener_Finish',
      async res => {
        if (res.DidFinishLoadingMap) {
          let R = new Rect();
          let mapRange = await R.createObj(
            12713494.101,
            3558023.0138,
            12743347.8314,
            3605125.566
          );
          await this.mapView.zoomToRange(mapRange, true);
        }
      }
    );
  }

  _featureQuery = async () => {
    let qu = new QueryBound();
    let queryBound = await qu.createObjByPoints(this.state.points);

    let map = await this.mapView.getMap();
    //let mapLayer = await map.getLayer(3);
    //console.log("mapLayer.getName:" + await mapLayer.getName());

    let vectorLayer = null;
    //获取查询图层对象（指定区图层）
    for (let i = 0; i < (await map.getLayerCount()); i++) {
      let mapLayer = await map.getLayer(i);
      if ((await mapLayer.getName()) == '水域') {
        vectorLayer = mapLayer;
        break;
      }
    }
    if (vectorLayer != null) {
      let featureQuery = new FeatureQuery();
      let query = await featureQuery.createObjByProperty(vectorLayer);
      await query.setQueryBound(queryBound);
      await query.setPageSize(10000);
      await query.setSpatialFilterRelationship(1);
      let featurePagedResult = await query.query();

      console.log(
        'featurePagedResult:' +
          (await featurePagedResult._MGFeaturePagedResultId)
      );
      let pagecount = await featurePagedResult.getPageCount();
      let getTotalFeatureCount = await featurePagedResult.getTotalFeatureCount();

      let graphicArry = [];
      let featureLst = await featurePagedResult.getPage(1);
      for (let i = 0; i < featureLst.length; i++) {
        let feature = await featureLst[i];
        let attributes = await feature.getAttributes();
        console.log('getAttributes:' + attributes);
        console.log('_MGFeatureId:' + feature._MGFeatureId);

        let graphicList = await feature.toGraphics(true);
        for (let j = 0; j < graphicList.length; j++) {
          console.log('_MGGraphicId:' + graphicList[j]._MGGraphicId);
          graphicArry.push(graphicList[j]);
        }
      }
      console.log(' graphicArry.length:' + graphicArry.length);
      let graphicsOverlay = await this.mapView.getGraphicsOverlay();
      await graphicsOverlay.addGraphics(graphicArry);
      await this.mapView.refresh();
      ToastAndroid.show(
        '查询结果总数为：' + getTotalFeatureCount + '，请在console控制台查看！',
        ToastAndroid.SHORT
      );
      console.log('pagecount:' + pagecount);
      console.log('getTotalFeatureCount:' + getTotalFeatureCount);
      console.log('featureLst:' + featureLst.length);
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
              <Text style={styles.text}>多边形查询</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
