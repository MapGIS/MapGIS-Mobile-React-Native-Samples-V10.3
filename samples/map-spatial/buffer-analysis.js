import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  DeviceEventEmitter,
  PixelRatio,
} from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import {
  MGMapView,
  Dot,
  Rect,
  Graphic,
  GraphicPoint,
  GraphicPolylin,
  GraphicPolygon,
  SpaAnalysis,
  PointF,
} from '@mapgis/mobile-react-native';

export default class MapBufferAnalysis extends Component {
  static navigationOptions = { title: '缓冲分析' };

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
          let rect = new Rect();
          let rectObj = await rect.createObj();
          rectObj = await this.mapView.getDispRange();

          let dot = new Dot();
          let dotObj = await dot.createObj(12729985, 3606886);
          let resolution =
            ((await rectObj.getXMax()) - (await rectObj.getXMin())) /
            ((await this.mapView.getWidth()) * 2 * 2 * 2);

          await this.mapView.zoomToCenter(dotObj, resolution, false);

          this.graphicsOverlay = await this.mapView.getGraphicsOverlay();

          let spaAnalysis = new SpaAnalysis();
          this.spaAnalysisObj = await spaAnalysis.createObj();
        }
      }
    );
  }

  /**
   * 固定点缓冲分析
   */
  pointBuffer = async () => {
    await this.graphicsOverlay.removeAllGraphics();

    //点坐标(地图坐标)
    let dot = new Dot();
    let dotObj = await dot.createObj(12729985, 3606886);
    //创建点图形对象
    let graphicPoint = new GraphicPoint();
    let graphicPointObj = await graphicPoint.createObj();
    //设置点图形样式
    await graphicPointObj.setPoint(dotObj);
    await graphicPointObj.setColor('rgba(0, 0, 255, 50)');
    await graphicPointObj.setSize(10);

    //将点图形转换为几何要素进行分析
    let geometry = await Graphic.toGeometry(graphicPointObj);

    /*
     * 缓冲分析
     * 注意：
     * 当geometry几何的空间参考系单位和左右缓冲半径数值的单位一致时，最后一个参数sRefSrc赋值null
     * 当geometry的空间参考系单位和左右缓冲半径数值的单位不一致时，必须传入空间参考系对象sRefSrc
     * 如：缓冲半径是米，geom几何单位不是米，需要传入的sRefSrc是geometry数据的空间参考系，作为源空间参考系
     */
    let geoPolygons = await this.spaAnalysisObj.buffer(geometry, 2000, 0, null);

    //将分析结果要素转为几何图形
    let graphics = await Graphic.toGraphicsFromGeometry(geoPolygons);

    //绘制点缓冲区分析结果图形
    for (let i = 0; i < graphics.length; i++) {
      let graphic = graphics[i];
      //设置缓冲分析结果图形填充色
      await graphic.setColor('rgba(255, 0, 255, 50)');
      //显示缓冲分析结果图形
      await this.graphicsOverlay.addGraphic(graphic);
    }

    //将点图形添加到自定义图层GraphicLayer中
    await this.graphicsOverlay.addGraphic(graphicPointObj);
    //刷新地图
    await this.mapView.refresh();
  };

  /**
   *固定线缓冲分析
   */
  lineBuffer = async () => {
    //清除绘制图形
    await this.graphicsOverlay.removeAllGraphics();

    //点坐标（地图坐标）
    let dot = new Dot();
    let dotArr = [];
    let dotObj1 = await dot.createObj(12719530, 3603327);
    let dotObj2 = await dot.createObj(12736224, 3620660);
    dotArr.push(dotObj1);
    dotArr.push(dotObj2);

    //创建线图形对象
    let graphicPolylin = new GraphicPolylin();
    let graphicPolylinObj = await graphicPolylin.createObj();
    await graphicPolylinObj.appendPoints(dotArr);
    await graphicPolylinObj.setColor('rgba(0, 0, 255, 50)');
    await graphicPolylinObj.setLineWidth(5);

    //将线要素转换为线几何要素进行解析
    let geometry = await Graphic.toGeometry(graphicPolylinObj);

    //线缓冲分析，设置线周围1000米区域
    /*
     * 缓冲分析
     * 注意：
     * 当geometry几何的空间参考系单位和左右缓冲半径数值的单位一致时，最后一个参数sRefSrc赋值null
     * 当geometry的空间参考系单位和左右缓冲半径数值的单位不一致时，必须传入空间参考系对象sRefSrc
     * 如：缓冲半径是米，geom几何单位不是米，需要传入的sRefSrc是geometry数据的空间参考系，作为源空间参考系
     */
    let geoPolygons = await this.spaAnalysisObj.buffer(
      geometry,
      1000,
      1000,
      null
    );

    //将分析结果要素转为几何图形
    let graphics = await Graphic.toGraphicsFromGeometry(geoPolygons);

    //绘制点缓冲区分析结果图形
    for (let i = 0; i < graphics.length; i++) {
      let graphic = graphics[i];
      //设置缓冲分析结果图形填充色
      await graphic.setColor('rgba(255, 0, 255, 50)');
      //显示缓冲分析结果图形
      await this.graphicsOverlay.addGraphic(graphic);
    }

    //将线图形添加到自定义图层GraphicLayer中
    await this.graphicsOverlay.addGraphic(graphicPolylinObj);
    //刷新地图
    await this.mapView.refresh();
  };

  /**
   *固定区缓冲分析
   */
  areaBuffer = async () => {
    //清除绘制图形
    await this.graphicsOverlay.removeAllGraphics();

    //根据屏幕的高宽自定义坐标点
    let pointF = new PointF();
    let pointFObj1 = await pointF.createObj(
      (this.mapViewWidth * 1.0) / 10,
      (this.mapViewHeight * 1.0) / 10
    );
    let pointFObj2 = await pointF.createObj(
      (this.mapViewWidth * 4.0) / 10,
      (this.mapViewHeight * 1.0) / 10
    );
    let pointFObj3 = await pointF.createObj(
      (this.mapViewWidth * 5.5) / 10,
      (this.mapViewHeight * 2.8) / 10
    );
    let pointFObj4 = await pointF.createObj(
      (this.mapViewWidth * 3.5) / 10,
      (this.mapViewHeight * 4.5) / 10
    );
    let pointFObj5 = await pointF.createObj(
      (this.mapViewWidth * 2.0) / 10,
      (this.mapViewHeight * 4.5) / 10
    );

    let dotArr = [];
    let dot1 = await this.mapView.viewPointToMapPoint(pointFObj1);
    let dot2 = await this.mapView.viewPointToMapPoint(pointFObj2);
    let dot3 = await this.mapView.viewPointToMapPoint(pointFObj3);
    let dot4 = await this.mapView.viewPointToMapPoint(pointFObj4);
    let dot5 = await this.mapView.viewPointToMapPoint(pointFObj5);
    let dot6 = await this.mapView.viewPointToMapPoint(pointFObj1);
    dotArr.push(dot1);
    dotArr.push(dot2);
    dotArr.push(dot3);
    dotArr.push(dot4);
    dotArr.push(dot5);
    dotArr.push(dot6);

    //创建多边形图形对象并初始化
    let graphicPolygon = new GraphicPolygon();
    let graphicPolygonObj = await graphicPolygon.createObj();
    await graphicPolygonObj.setPoints(dotArr, null);
    await graphicPolygonObj.setColor('rgba(0, 0, 255, 50)');

    //把自定义多边形图形转化为区几何图形
    let geometry = await Graphic.toGeometry(graphicPolygonObj);

    // 区缓冲分析，设置线周围1000米区域
    /*
     * 缓冲分析
     * 注意：
     * 当geometry几何的空间参考系单位和左右缓冲半径数值的单位一致时，最后一个参数sRefSrc赋值null
     * 当geometry的空间参考系单位和左右缓冲半径数值的单位不一致时，必须传入空间参考系对象sRefSrc
     * 如：缓冲半径是米，geom几何单位不是米，需要传入的sRefSrc是geometry数据的空间参考系，作为源空间参考系
     */
    let geoPolygons = await this.spaAnalysisObj.buffer(geometry, 1000, 0, null);

    //将分析结果要素转为几何图形
    let graphics = await Graphic.toGraphicsFromGeometry(geoPolygons);

    for (let i = 0; i < graphics.length; i++) {
      let graphic = graphics[i];
      //设置缓冲分析结果图形填充色
      await graphic.setColor('rgba(255, 0, 255, 50)');
      //显示缓冲分析结果图形
      await this.graphicsOverlay.addGraphic(graphic);
    }

    //将多边形图形添加到自定义图层GraphicLayer中
    await this.graphicsOverlay.addGraphic(graphicPolygonObj);
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
          onLayout={event => this.onLayout(event)}
        />
        <View style={styles.buttons}>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.pointBuffer}>
              <Text style={styles.text}>点缓冲</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.lineBuffer}>
              <Text style={styles.text}>线缓冲</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.areaBuffer}>
              <Text style={styles.text}>区缓冲</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
