import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  DeviceEventEmitter,
  ToastAndroid,
} from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import {
  MGMapView,
  Dot,
  Rect,
  Graphic,
  GraphicPolygon,
  SpaAnalysis,
  GraphicsOverlay,
  FeatureQuery,
} from '@mapgis/mobile-react-native';

export default class MapClipAnalysis extends Component {
  static navigationOptions = { title: '裁剪分析' };

  constructor() {
    super();
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
          //设置地图初始中心点与缩放范围
          let rect = new Rect();
          let rectObj = await rect.createObj();
          rectObj = await this.mapView.getDispRange();

          let dot = new Dot();
          let dotObj = await dot.createObj(12721901.5, 3560170.1);
          let resolution =
            ((await rectObj.getXMax()) - (await rectObj.getXMin())) /
            ((await this.mapView.getWidth()) * 2 * 2 * 2 * 2);

          await this.mapView.zoomToCenter(dotObj, resolution, false);

          //初始化显示分析对象图形
          this.init();
        }
      }
    );
  }

  /**
   * 初始化显示分析对象图形
   */
  async init() {
    let spaAnalysis = new SpaAnalysis();
    this.spaAnalysisObj = await spaAnalysis.createObj();

    //裁剪数据图层
    this.graphicsOverlayData = await this.mapView.getGraphicsOverlay();
    //裁剪叠加层
    let graphicOverlayResult = new GraphicsOverlay();
    this.graphicOverlayResObj = await graphicOverlayResult.createObj();
    let graphicsOverlays = await this.mapView.getGraphicsOverlays();
    if (graphicsOverlays != null) {
      await graphicsOverlays.add(this.graphicOverlayResObj);
    }

    //清空绘制图形
    await this.graphicsOverlayData.removeAllGraphics();

    //查询显示被裁剪几何图形
    this.initClipGeometry();

    //裁剪多边形点坐标（地图坐标）
    let dotArr = [];
    let dot = new Dot();
    let dotObj1 = await dot.createObj(12720512.5, 3558371.2);
    let dotObj2 = await dot.createObj(12720358.6, 3561554.1);
    let dotObj3 = await dot.createObj(12723017.1, 3561615.5);
    let dotObj4 = await dot.createObj(12723074.1, 3559360.3);
    let dotObj5 = await dot.createObj(12720512.5, 3558371.2);
    dotArr.push(dotObj1);
    dotArr.push(dotObj2);
    dotArr.push(dotObj3);
    dotArr.push(dotObj4);
    dotArr.push(dotObj5);

    //创建并初始化裁剪多边形图形
    let graphicPolygon = new GraphicPolygon();
    let graphicPolygonObj = await graphicPolygon.createObj();
    await graphicPolygonObj.appendPoints(dotArr);
    await graphicPolygonObj.setColor('rgba(0, 153, 0, 60)');
    await graphicPolygonObj.setBorderlineWidth(5);
    await graphicPolygonObj.setBorderlineColor('rgba(51, 51, 51, 255)');
    //显示裁剪多边形图形
    await this.graphicsOverlayData.addGraphic(graphicPolygonObj);

    //将裁剪多边形图形转换为几何对象进行分析
    let geometry = await Graphic.toGeometry(graphicPolygonObj);

    this.geoPolygon = geometry;

    //刷新地图
    await this.mapView.refresh();
  }

  /**
   * 初始化被裁剪分析的几何图形
   * 查询“Water_polygon”图层的区要素
   */
  async initClipGeometry() {
    this.map = await this.mapView.getMap();

    //获取查询图层对象（指定区图层）
    let vectorLayer = null;
    for (let i = 0; i < (await this.map.getLayerCount()); i++) {
      let mapLayer = await this.map.getLayer(i);
      if ((await mapLayer.getName()) === '水域') {
        vectorLayer = mapLayer;
      }
    }
    if (vectorLayer === null) {
      return;
    }

    //初始化查询对象
    let featureQuery = new FeatureQuery();
    let featureQueryObj = await featureQuery.createObjByVectorLayer(
      vectorLayer
    );
    //设置查询条件
    let condition = "Name like '%黄家湖%'";
    await featureQueryObj.setWhereClause(condition);
    await featureQueryObj.setPageSize(1000);
    await featureQueryObj.setSpatialFilterRelationship(1);
    await featureQueryObj.setReturnGeometry(true);
    //进行查询
    let queryRes = await featureQueryObj.query();
    let featureCnt = await queryRes.getTotalFeatureCount();
    if (featureCnt !== 0) {
      ToastAndroid.show('查询结果个数为:' + featureCnt, ToastAndroid.SHORT);
      this.showResultFeature(queryRes);
    } else {
      ToastAndroid.show('查询不到符合条件的要素', ToastAndroid.SHORT);
    }
  }

  /**
   * 显示查询结果要素
   * @param {*} queryResult
   */
  async showResultFeature(queryResult) {
    //取第一页结果要素
    let featureLst = await queryResult.getPage(1);
    //遍历要素获取其几何信息
    for (let i = 0; i < featureLst.length; i++) {
      //获取要素
      let feature = featureLst[i];
      //获取要素的几何信息（默认查询区要素）
      this.geometry = await feature.getGeometry();
      //获取要素对应的图形
      let graphics = await feature.toGraphics(true);
      for (let j = 0; j < graphics.length; j++) {
        let graphic = graphics[j];
        await graphic.setColor('rgba(0, 0, 255, 100)');
      }

      //高亮显示查询的结果
      await this.graphicsOverlayData.addGraphics(graphics);
    }
  }

  /**
   * 显示分析结果图形
   * @param {*} geoClip
   */
  async showGraphicsByAnalysis(geoClip) {
    if (geoClip === null) {
      return;
    }
    //将分析结果要素转为几何图形
    let graphics = await Graphic.toGraphicsFromGeometry(geoClip);
    //绘制裁剪分析结果图形
    for (let i = 0; i < graphics.length; i++) {
      let graphic = graphics[i];

      //设置裁剪分析结果图形填充色
      await graphic.setColor('rgba(255, 0, 0, 90)');
      //显示裁剪分析结果图形
      await this.graphicOverlayResObj.addGraphic(graphic);
    }
    //刷新地图
    await this.mapView.refresh();
  }

  /**
   * 多边形裁剪（内裁剪）
   */
  clipByCircle = async () => {
    //清空分析结果图层
    await this.graphicOverlayResObj.removeAllGraphics();

    if (this.geometry !== null && this.geoPolygon !== null) {
      //得到裁剪区
      let geoClip = await this.spaAnalysisObj.clipWithType(
        this.geometry,
        this.geoPolygon,
        0
      );

      //将分析结果要素转为几何图形
      this.showGraphicsByAnalysis(geoClip);
    }
  };

  /**
   *多边形裁剪（外裁剪）
   */
  clipByPolygon = async () => {
    //清除绘制图形
    await this.graphicOverlayResObj.removeAllGraphics();

    if (this.geometry !== null && this.geoPolygon !== null) {
      //得到裁剪区
      let geoClip = await this.spaAnalysisObj.clipWithType(
        this.geometry,
        this.geoPolygon,
        1
      );

      //将分析结果要素转为几何图形
      this.showGraphicsByAnalysis(geoClip);
    }
  };

  /**
   * 重置
   */
  reset = async () => {
    //清空分析结果图层
    await this.graphicOverlayResObj.removeAllGraphics();
    //刷新地图
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
        <View style={styles.buttons}>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.clipByCircle}>
              <Text style={styles.text}>多边形内裁</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.clipByPolygon}>
              <Text style={styles.text}>多边形外裁</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.reset}>
              <Text style={styles.text}>重置</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
