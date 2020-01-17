import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  DeviceEventEmitter,
  ToastAndroid,
  PixelRatio,
  StyleSheet,
} from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import {
  MGMapView,
  Rect,
  GraphicPolylin,
  GraphicPolygon,
  Graphic,
  PointF,
  GraphicsOverlay,
  SpaAnalysis,
} from '@mapgis/mobile-react-native';

export default class MapOverlayAnalysis extends Component {
  static navigationOptions = { title: '叠加分析' };

  constructor() {
    super();
  }

  onLayout = event => {
    this.mapViewHeight = event.nativeEvent.layout.height * PixelRatio.get();
    this.mapViewWidth = event.nativeEvent.layout.width * PixelRatio.get();
  };

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
          //设置地图初始中心点与缩放范围
          let rect = new Rect();
          let rectObj = await rect.createObj(
            12705276.572663,
            3542912.332349,
            12746062.17078,
            3607262.942711
          );
          await this.mapView.zoomToRange(rectObj, false);

          //初始化叠加分析需要的数据
          this.initView();
        }
      }
    );
  }

  /**
   *初始化
   */
  async initView() {
    let pointF = new PointF();
    this.pointFObj1 = await pointF.createObj(
      (this.mapViewWidth * 1.0) / 10,
      (this.mapViewHeight * 1.0) / 10
    );
    this.pointFObj2 = await pointF.createObj(
      (this.mapViewWidth * 4.0) / 10,
      (this.mapViewHeight * 1.0) / 10
    );
    this.pointFObj3 = await pointF.createObj(
      (this.mapViewWidth * 5.5) / 10,
      (this.mapViewHeight * 2.8) / 10
    );
    this.pointFObj4 = await pointF.createObj(
      (this.mapViewWidth * 3.5) / 10,
      (this.mapViewHeight * 4.5) / 10
    );
    this.pointFObj5 = await pointF.createObj(
      (this.mapViewWidth * 2.0) / 10,
      (this.mapViewHeight * 4.5) / 10
    );
    this.pointFObj6 = await pointF.createObj(
      (this.mapViewWidth * 3.0) / 10,
      (this.mapViewHeight * 1.5) / 10
    );
    this.pointFObj7 = await pointF.createObj(
      (this.mapViewWidth * 5.5) / 10,
      (this.mapViewHeight * 1.5) / 10
    );
    this.pointFObj8 = await pointF.createObj(
      (this.mapViewWidth * 7.0) / 10,
      (this.mapViewHeight * 3.0) / 10
    );
    this.pointFObj9 = await pointF.createObj(
      (this.mapViewWidth * 6.0) / 10,
      (this.mapViewHeight * 3.0) / 10
    );
    this.pointFObj10 = await pointF.createObj(
      (this.mapViewWidth * 2.8) / 10,
      (this.mapViewHeight * 2.8) / 10
    );

    //叠加分析数据层
    this.graphicsOverlayData = await this.mapView.getGraphicsOverlay();
    //叠加分析结果层
    let graphicsOverlayResult = new GraphicsOverlay();
    this.graphicsOverlayResultObj = await graphicsOverlayResult.createObj();
    let graphicOverlays = await this.mapView.getGraphicsOverlays();
    await graphicOverlays.add(this.graphicsOverlayResultObj);

    let spaAnalysis = new SpaAnalysis();
    this.spaAnalysisObj = await spaAnalysis.createObj();

    //绘制多边形图形
    this.drawPolygon();
  }

  /**
   * 初始化区
   */
  async drawPolygon() {
    //将视图坐标转化为地图坐标
    let point1 = await this.mapView.viewPointToMapPoint(this.pointFObj1);
    let point2 = await this.mapView.viewPointToMapPoint(this.pointFObj2);
    let point3 = await this.mapView.viewPointToMapPoint(this.pointFObj3);
    let point4 = await this.mapView.viewPointToMapPoint(this.pointFObj4);
    let point5 = await this.mapView.viewPointToMapPoint(this.pointFObj5);
    let point6 = await this.mapView.viewPointToMapPoint(this.pointFObj6);
    let point7 = await this.mapView.viewPointToMapPoint(this.pointFObj7);
    let point8 = await this.mapView.viewPointToMapPoint(this.pointFObj8);
    let point9 = await this.mapView.viewPointToMapPoint(this.pointFObj9);
    let point10 = await this.mapView.viewPointToMapPoint(this.pointFObj10);
    let dotArrA = [];
    dotArrA.push(point1);
    dotArrA.push(point2);
    dotArrA.push(point3);
    dotArrA.push(point4);
    dotArrA.push(point5);
    dotArrA.push(point1);
    //创建目标图形
    let graphicPolygonA = new GraphicPolygon();
    let graphicPolygonAObj = await graphicPolygonA.createObj();
    await graphicPolygonAObj.setPoints(dotArrA, null);
    await graphicPolygonAObj.setBorderlineColor('rgba(0, 0, 255, 255)');
    await graphicPolygonAObj.setColor('rgba(0, 0, 255, 50)');
    await this.graphicsOverlayData.addGraphic(graphicPolygonAObj);
    let dotArrB = [];
    dotArrB.push(point6);
    dotArrB.push(point7);
    dotArrB.push(point8);
    dotArrB.push(point9);
    dotArrB.push(point10);
    dotArrB.push(point6);
    let graphicPolygonB = new GraphicPolygon();
    let graphicPolygonBObj = await graphicPolygonB.createObj();
    await graphicPolygonBObj.setPoints(dotArrB, null);
    await graphicPolygonBObj.setBorderlineColor('rgba(0, 0, 255, 255)');
    await graphicPolygonBObj.setColor('rgba(0, 0, 255, 50)');
    await this.graphicsOverlayData.addGraphic(graphicPolygonBObj);
    await this.mapView.refresh();

    this.geometryA = await Graphic.toGeometry(graphicPolygonAObj);
    this.geometryB = await Graphic.toGeometry(graphicPolygonBObj);
  }

  /**
   * 初始化线与区
   */
  drawPolylinAndPolygon = async () => {
    //初始化区
    this.drawPolygon();

    //创建线图形
    let graphicPolylin = new GraphicPolylin();
    let graphicPolylinObj = await graphicPolylin.createObj();
    //将视图坐标转化为地图坐标
    let point1 = await this.mapView.viewPointToMapPoint(this.pointFObj2);
    let point2 = await this.mapView.viewPointToMapPoint(this.pointFObj3);
    let point3 = await this.mapView.viewPointToMapPoint(this.pointFObj4);
    //初始化折线图形
    let dotArr = [];
    dotArr.push(point1);
    dotArr.push(point2);
    dotArr.push(point3);
    await graphicPolylinObj.setPoints(dotArr);
    await graphicPolylinObj.setColor('rgba(255, 0, 0, 255)');
    await graphicPolylinObj.setLineWidth(5);

    //将线图形添加到数据层，并刷新地图
    await this.graphicsOverlayData.addGraphic(graphicPolylinObj);
    await this.mapView.refresh();

    this.geoVarLine = await Graphic.toGeometry(graphicPolylinObj);
  };

  /**
   * 重置两区
   */
  resetPolygon = async () => {
    //清空结果层与分析层的图形
    await this.graphicsOverlayData.removeAllGraphics();
    await this.graphicsOverlayResultObj.removeAllGraphics();

    //绘制区
    this.drawPolygon();
  };

  /**
   * 重置线与区
   */
  resetLAndP = async () => {
    //清空结果层与分析层的图形
    await this.graphicsOverlayData.removeAllGraphics();
    await this.graphicsOverlayResultObj.removeAllGraphics();

    //绘制线与区
    this.drawPolylinAndPolygon();
  };

  /**
   *点击求交
   */
  calIntersectionBtn = async () => {
    //区图形
    this.resetPolygon();

    if (this.geometryA == null || this.geometryB == null) {
      return;
    }

    //两个区几何要素求交得到交集
    let geoIntersection = await this.spaAnalysisObj.intersection(
      this.geometryA,
      this.geometryB
    );

    //将求交结果转为自定义图形
    let graphics = await Graphic.toGraphicsFromGeometry(geoIntersection);
    if (graphics.length === 0) {
      ToastAndroid.show('相交失败', ToastAndroid.SHORT);
    } else {
      //将求交结果图形添加到叠加分析结果层
      for (let i = 0; i < graphics.length; i++) {
        let graphic = graphics[i];
        await graphic.setColor('rgba(50, 0, 255, 200)');
        await this.graphicsOverlayResultObj.addGraphic(graphic);
      }
    }

    await this.mapView.refresh();
  };

  /**
   * 点击求并集
   */
  calUnionBtn = async () => {
    //区图形
    this.resetPolygon();

    if (this.geometryA == null || this.geometryB == null) {
      return;
    }

    //两个区几何要素求并得到并集
    let geoUnion = await this.spaAnalysisObj.union(
      this.geometryA,
      this.geometryB
    );

    //将求并结果转为自定义图形
    let graphics = await Graphic.toGraphicsFromGeometry(geoUnion);
    if (graphics.length === 0) {
      ToastAndroid.show('图形没有并集', ToastAndroid.SHORT);
    } else {
      //将求并结果图形添加到叠加分析结果层
      for (let i = 0; i < graphics.length; i++) {
        if (graphics.length === 3) {
          await graphics[0].setColor('rgba(255, 100, 19, 255)');
          await graphics[1].setColor('rgba(255, 255, 47, 255)');
          await graphics[2].setColor('rgba(0, 162, 255, 255)');
        }
        await this.graphicsOverlayResultObj.addGraphic(graphics[i]);
      }
      await this.mapView.refresh();
    }
  };

  /**
   * 点击差值
   */
  calDifferenceBtn = async () => {
    //区图形
    this.resetPolygon();

    if (this.geometryA == null || this.geometryB == null) {
      return;
    }

    //两个几何对象求差值
    let geoDifference = await this.spaAnalysisObj.difference(
      this.geometryA,
      this.geometryB
    );

    //将差值结果转为自定义图形
    let graphics = await Graphic.toGraphicsFromGeometry(geoDifference);
    if (graphics.length === 0) {
      ToastAndroid.show('求差值失败', ToastAndroid.SHORT);
    } else {
      //将差值结果图形添加到叠加分析结果层
      for (let i = 0; i < graphics.length; i++) {
        let graphic = graphics[i];
        await graphic.setColor('rgba(50, 0, 255, 200)');
        await this.graphicsOverlayResultObj.addGraphic(graphic);
      }
      await this.mapView.refresh();
    }
  };

  /**
   * 点击对称差
   */
  symmetricDifferenceBtn = async () => {
    //区图形
    this.resetPolygon();

    if (this.geometryA == null || this.geometryB == null) {
      return;
    }

    //两个几何对象求差值
    let geoSymmetricDifference = await this.spaAnalysisObj.symmetricDifference(
      this.geometryA,
      this.geometryB
    );
    //将差值结果转为自定义图形
    let graphics = await Graphic.toGraphicsFromGeometry(geoSymmetricDifference);
    if (graphics.length === 0) {
      ToastAndroid.show('求对称差失败', ToastAndroid.SHORT);
    } else {
      //将差值结果图形添加到叠加分析结果层
      for (let i = 0; i < graphics.length; i++) {
        let graphic = graphics[i];
        await graphic.setColor('rgba(50, 0, 255, 200)');
        await this.graphicsOverlayResultObj.addGraphic(graphic);
      }
      await this.mapView.refresh();
    }
  };

  /**
   * 点击分割
   */
  setSplitBtn = async () => {
    //重置线与区
    this.resetLAndP();

    if (this.geoVarLine == null || this.geometryB == null) {
      return;
    }

    //两个几何对象分割
    let geoSplit = await this.spaAnalysisObj.split(
      this.geometryB,
      this.geoVarLine
    );

    //将分割结果转为自定义图形
    let graphics = await Graphic.toGraphicsFromGeometry(geoSplit);
    if (graphics.length === 0) {
      ToastAndroid.show('分割失败', ToastAndroid.SHORT);
    } else {
      //将分割结果图形添加到叠加分析结果层
      for (let i = 0; i < graphics.length; i++) {
        let graphicPylygonRes = new GraphicPolygon();
        let graphicPylygonResObj = await graphicPylygonRes.createObj();
        graphicPylygonResObj = graphics[i];
        if (i === 0) {
          await graphicPylygonResObj.setColor('rgba(34, 139, 34, 255)');
        } else {
          await graphicPylygonResObj.setColor('rgba(255, 215, 0, 255)');
        }
        await graphicPylygonResObj.setBorderlineColor('rgba(0, 255, 0, 255)');
        await graphicPylygonResObj.setBorderlineWidth(5);
        await this.graphicsOverlayResultObj.addGraphic(graphicPylygonResObj);
      }
      await this.mapView.refresh();
    }
  };

  /**
   * 点击合并
   */
  setMergeBtn = async () => {
    //区图形
    this.resetPolygon();

    if (this.geometryA == null || this.geometryB == null) {
      return;
    }

    //合并两个几何对象
    let geoMerge = await this.spaAnalysisObj.merge(
      this.geometryA,
      this.geometryB
    );
    //将合并结果转为自定义图形
    let graphics = await Graphic.toGraphicsFromGeometry(geoMerge);
    if (graphics.length === 0) {
      ToastAndroid.show('合并失败', ToastAndroid.SHORT);
    } else {
      //将合并结果图形添加到叠加分析结果层
      for (let i = 0; i < graphics.length; i++) {
        let graphic = graphics[i];
        await graphic.setColor('rgba(204, 102, 0, 200)');
        await this.graphicsOverlayResultObj.addGraphic(graphic);
      }
      await this.mapView.refresh();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <MGMapView
          ref="mapView"
          onGetInstance={this.onGetInstance}
          style={styles.mapView}
          onLayout={event => this.onLayout(event)}
        />
        <View style={styles.buttons}>
          <View style={style.button}>
            <TouchableOpacity onPress={this.calIntersectionBtn}>
              <Text style={styles.text}>求交</Text>
            </TouchableOpacity>
          </View>
          <View style={style.button}>
            <TouchableOpacity onPress={this.calUnionBtn}>
              <Text style={styles.text}>求并</Text>
            </TouchableOpacity>
          </View>
          <View style={style.button}>
            <TouchableOpacity onPress={this.calDifferenceBtn}>
              <Text style={styles.text}>差值</Text>
            </TouchableOpacity>
          </View>
          <View style={style.button}>
            <TouchableOpacity onPress={this.symmetricDifferenceBtn}>
              <Text style={styles.text}>对称差</Text>
            </TouchableOpacity>
          </View>
          <View style={style.button}>
            <TouchableOpacity onPress={this.setMergeBtn}>
              <Text style={styles.text}>合并</Text>
            </TouchableOpacity>
          </View>
          <View style={style.button}>
            <TouchableOpacity onPress={this.setSplitBtn}>
              <Text style={styles.text}>分割</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  button: {
    padding: 8,
    margin: 2,
    borderRadius: 30,
    backgroundColor: 'rgba(245,83,61,0.8)',
  },
});
