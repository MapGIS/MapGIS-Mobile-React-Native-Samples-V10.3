import React, { Component } from 'react';
import {
  Alert,
  View,
  ToastAndroid,
  TouchableOpacity,
  Text,
  Button,
  StyleSheet,
  TextInput,
  DeviceEventEmitter,
} from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import { ANN_FILE_PATH } from '../utils';
import {
  Rect,
  MGMapView,
  Dot,
  GraphicPoint,
  QueryBound,
  FeatureQuery,
  GraphicPolygon,
  AnnotationView,
  Image,
  Annotation,
} from '@mapgis/mobile-react-native';

/**
 * @content 复合查询
 * @author fjl 2019-7-25 下午2:52:36
 */
export default class MapCompoundQuery extends Component {
  static navigationOptions = { title: '复合查询' };
  constructor() {
    super();
    this.state = {
      queryRect: null,
      firstDot: null,
      secondDot: null,
      isFirstPoint: true,
      isClickTwo: false,
    };
  }

  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.registerMapLoadListener();
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
  };

  componentDidMount() {
    DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.LoadMapListener_Finish',
      async res => {
        if (res.DidFinishLoadingMap) {
          let R = new Rect();
          let mapRange = await R.createObj(
            12705276.572663,
            3542912.332349,
            12746062.17078,
            3607262.942711
          );
          await this.mapView.zoomToRange(mapRange, false);
        }
      }
    );

    DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.single_tap_event',
      async res => {
        let graphicPointModule = new GraphicPoint();
        let graphicPoint = await graphicPointModule.createObj();
        let dotModule = new Dot();
        let dot = await dotModule.createObj(res.x, res.y);
        await graphicPoint.setPointAndSize(dot, 5);

        if (this.state.isFirstPoint) {
          this.setState({
            isFirstPoint: false,
            firstDot: dot,
            isClickTwo: false,
          });
          this.setState({ isClickTwo: false });
        } else {
          this.setState({
            isFirstPoint: true,
            secondDot: dot,
            isClickTwo: true,
          });
          this.setState({ isClickTwo: true });
        }
        let graphicsOverlay = await this.mapView.getGraphicsOverlay();
        await graphicsOverlay.addGraphic(graphicPoint);
        await this.mapView.refresh();

        if (this.state.isClickTwo) {
          let xmin, xmax, ymin, ymax;

          let leftDot = this.state.firstDot;
          let rightDot = this.state.secondDot;

          xmin = await leftDot.getX();
          xmax = await rightDot.getX();
          ymin = await leftDot.getY();
          ymax = await rightDot.getY();

          let dotArray = [];
          let dot1 = await dotModule.createObj(xmin, ymin);
          let dot2 = await dotModule.createObj(xmin, ymax);
          let dot3 = await dotModule.createObj(xmax, ymax);
          let dot4 = await dotModule.createObj(xmax, ymin);
          dotArray.push(dot1);
          dotArray.push(dot2);
          dotArray.push(dot3);
          dotArray.push(dot4);
          //为rect赋予范围
          let rectMoudle = new Rect();
          let qryRect = await rectMoudle.createObj(xmin, ymin, xmax, ymax);
          this.setState({ queryRect: qryRect });

          let graphicPolygonModule = new GraphicPolygon();
          let graphicPolygon = await graphicPolygonModule.createObj();

          await graphicPolygon.setColor('rgba(130, 130,130, 180)');
          await graphicPolygon.setBorderlineColor('rgba(100, 200, 0, 180)');
          await graphicPolygon.setBorderlineWidth(10);
          await graphicPolygon.setPoints(dotArray, null);

          await graphicsOverlay.removeAllGraphics();
          await graphicsOverlay.addGraphic(graphicPolygon);
          let annotationsOverlay = await this.mapView.getAnnotationsOverlay();
          await annotationsOverlay.removeAllAnnotations();
          await this.mapView.refresh();
          Alert.alert('属性查询条件', "Name like '%公园%'", [
            { text: '查询', onPress: this.featureQuery },
            { text: '取消', onPress: this.queryCancel },
          ]);
        }
      }
    );

    DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.AnnotationListenerA_ViewByAnn',
      async res => {
        let { AnnotationId } = res;
        var annotation = new Annotation();
        annotation._MGAnnotationId = AnnotationId;
        let annotationViewModule = new AnnotationView();
        let annotationView = await annotationViewModule.createObj(
          this.mapView,
          annotation
        );
        return annotationView;
      }
    );
  }

  featureQuery = async () => {
    //清空标注层
    let annotationsOverlay = await this.mapView.getAnnotationsOverlay();
    await annotationsOverlay.removeAllAnnotations();

    let condition = "Name like '%公园%'";

    let qu = new QueryBound();
    let queryBound = await qu.createObjByRect(this.state.queryRect);

    let map = await this.mapView.getMap();
    var mapLayer = await map.getLayer(11);
    console.log('mapLayer.getName:' + (await mapLayer.getName()));
    if (mapLayer != null) {
      let featureQuery = new FeatureQuery();
      let query = await featureQuery.createObjByProperty(mapLayer);
      await query.setWhereClause(condition);
      await query.setQueryBound(queryBound);
      await query.setPageSize(20);
      await query.setSpatialFilterRelationship(1);

      let featurePagedResult = await query.query();
      let pagecount = await featurePagedResult.getPageCount();
      let getTotalFeatureCount = await featurePagedResult.getTotalFeatureCount();

      let strFieldName = 'Name';

      let featureName = '';
      let featureLst = await featurePagedResult.getPage(1);
      for (var j = 0; j < featureLst.length; j++) {
        let feature = await featureLst[j];
        let attributes = await feature.getAttributes();
        console.log(
          'getAttributes:' +
            attributes +
            '--featureLst.length' +
            featureLst.length
        );
        var jsonObj = JSON.parse(attributes);
        console.log(
          'getAttributes:-jsonObj[strFieldName]---' + jsonObj[strFieldName]
        );

        featureName = jsonObj[strFieldName];

        //获取要素的几何信息（默认查询点要素）
        let fGeometry = await feature.getGeometry();
        let featureType = await fGeometry.getType();
        let dotX = 0;
        let dotY = 0;
        if (featureType == 1 || featureType == 2) {
          let dots3D = await fGeometry.getDots();
          let dot = await dots3D.get(0);
          dotX = await dot.getX();
          dotY = await dot.getY();
        }
        let pointModule = new Dot();
        let point = await pointModule.createObj(dotX, dotY);
        let image = new Image();
        let bmp = await image.createObjByLocalPath(ANN_FILE_PATH);
        let AnnotationModule = new Annotation();
        let annotation = await AnnotationModule.createObj(
          featureName,
          featureName,
          point,
          bmp
        );
        await annotationsOverlay.addAnnotation(annotation);
        await this.mapView.registerAnnotationListener();
      }
      await this.mapView.forceRefresh();
      ToastAndroid.show(
        '查询结果总数为：' + getTotalFeatureCount,
        ToastAndroid.LONG
      );
      console.log('pagecount:' + pagecount);
      console.log('getTotalFeatureCount:' + getTotalFeatureCount);
      console.log('featureLst:' + featureLst.length);
    }
  };

  queryCancel = async () => {
    let graphicsOverlay = await this.mapView.getGraphicsOverlay();
    await graphicsOverlay.removeAllGraphics();
    let annotationsOverlay = await this.mapView.getAnnotationsOverlay();
    await annotationsOverlay.removeAllAnnotations();
    await this.mapView.refresh();
  };

  compoundQry = async () => {
    ToastAndroid.show(
      '提示：在地图上点击两点确定范围，属性查询“四级点”图层名称含“公园”的POI点',
      ToastAndroid.LONG
    );

    await this.mapView.registerTapListener();
    let graphicsOverlay = await this.mapView.getGraphicsOverlay();
    await graphicsOverlay.removeAllGraphics();
    //清空标注层
    let annotationsOverlay = await this.mapView.getAnnotationsOverlay();
    await annotationsOverlay.removeAllAnnotations();
    await this.mapView.refresh();
  };

  render() {
    return (
      <View style={styles.container}>
        <MGMapView
          ref="mapView"
          onGetInstance={this.onGetInstance}
          style={styles.mapView}
        />

        <View style={style.form}>
          <Button title="拉框复合查询" onPress={this.compoundQry} />
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#292c36',
  },
  form: {
    padding: 15,
  },
  mapView: {
    flex: 1,
  },
  input: {
    color: '#000',
    fontSize: 16,
    marginTop: 15,
    // marginBottom: 15
  },
});
