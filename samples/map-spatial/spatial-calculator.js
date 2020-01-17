import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  DeviceEventEmitter,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import {
  MGMapView,
  Dot,
  Rect,
  GraphicPoint,
  GraphicPolylin,
  GraphicPolygon,
  SpaCalculator,
  Graphic,
  GeoVarLine,
} from '@mapgis/mobile-react-native';

export default class MapSpatialCalculator extends Component {
  static navigationOptions = { title: '空间计算' };

  constructor() {
    super();
    this.state = {
      calResult: '',
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
    this.mapLoadListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.LoadMapListener_Finish',
      async res => {
        if (res.DidFinishLoadingMap) {
          //设置地图初始中心点与缩放范围
          let rect = new Rect();
          let rectObj = await rect.createObj();
          rectObj = await this.mapView.getDispRange();

          let dot = new Dot();
          let dotObj = await dot.createObj(12739302, 3583192);
          let resolution =
            ((await rectObj.getXMax()) - (await rectObj.getXMin())) /
            ((await this.mapView.getWidth()) * 2);

          await this.mapView.zoomToCenter(dotObj, resolution, false);

          //初始化加载几何图形
          this.initMapView();
        }
      }
    );
  }

  componentWillUnmount = () => {
    this.mapLoadListener.remove();
  };

  /**
   *初始化
   */
  async initMapView() {
    this.graphicsOverlay = await this.mapView.getGraphicsOverlay();

    //清空图形
    await this.graphicsOverlay.removeAllGraphics();
    //点坐标(地图坐标)
    let dot = new Dot();
    let dotObj1 = await dot.createObj(12725507, 3594578.7);
    let dotObj2 = await dot.createObj(12716346.4, 3572194.3);
    let dotObj3 = await dot.createObj(12740012.7, 3555067);
    let dotObj4 = await dot.createObj(12772056, 3573192);
    let dotObj5 = await dot.createObj(12751302, 3598475);
    let dotObj6 = await dot.createObj(12739302, 3583192);
    let dotObj7 = await dot.createObj(12721000, 3572700);
    let dotObj8 = await dot.createObj(12758302, 3572700);
    let dotObj9 = await dot.createObj(12739302, 3610000);
    let dotObj10 = await dot.createObj(12772056, 3610000);
    //多边形A
    let dotArrA = [];
    dotArrA.push(dotObj1);
    dotArrA.push(dotObj2);
    dotArrA.push(dotObj3);
    dotArrA.push(dotObj1);
    let graphicPolygonA = new GraphicPolygon();
    this.graphicPolygonAObj = await graphicPolygonA.createObj();
    await this.graphicPolygonAObj.setPoints(dotArrA, null);
    await this.graphicPolygonAObj.setColor('rgba(50, 0, 255, 50)');
    await this.graphicPolygonAObj.setBorderlineColor('rgba(51, 51, 51, 255)');
    await this.graphicPolygonAObj.setBorderlineWidth(5);
    await this.graphicsOverlay.addGraphic(this.graphicPolygonAObj);
    //多边形B
    let dotArrB = [];
    dotArrB.push(dotObj4);
    dotArrB.push(dotObj5);
    dotArrB.push(dotObj10);
    dotArrB.push(dotObj4);
    let graphicPolygonB = new GraphicPolygon();
    this.graphicPolygonBObj = await graphicPolygonB.createObj();
    await this.graphicPolygonBObj.setPoints(dotArrB, null);
    await this.graphicPolygonBObj.setColor('rgba(50, 0, 255, 50)');
    await this.graphicPolygonBObj.setBorderlineColor('rgba(51, 51, 51, 255)');
    await this.graphicPolygonBObj.setBorderlineWidth(5);
    await this.graphicsOverlay.addGraphic(this.graphicPolygonBObj);
    //线A
    let graphicPolylinA = new GraphicPolylin();
    this.graphicPolylinAObj = await graphicPolylinA.createObj();
    await this.graphicPolylinAObj.appendPoint(dotObj1);
    await this.graphicPolylinAObj.appendPoint(dotObj5);
    await this.graphicPolylinAObj.setLineWidth(6);
    await this.graphicPolylinAObj.setColor('rgba(51, 0, 255, 255)');
    await this.graphicsOverlay.addGraphic(this.graphicPolylinAObj);
    //线B
    let graphicPolylinB = new GraphicPolylin();
    this.graphicPolylinBObj = await graphicPolylinB.createObj();
    await this.graphicPolylinBObj.appendPoint(dotObj6);
    await this.graphicPolylinBObj.appendPoint(dotObj9);
    await this.graphicPolylinBObj.setLineWidth(6);
    await this.graphicPolylinBObj.setColor('rgba(51, 0, 255, 255)');
    await this.graphicsOverlay.addGraphic(this.graphicPolylinBObj);
    //点A
    let graphicPointA = new GraphicPoint();
    this.graphicPointAObj = await graphicPointA.createObj();
    await this.graphicPointAObj.setPointAndSize(dotObj6, 10);
    await this.graphicPointAObj.setColor('rgba(51, 0, 255, 255)');
    await this.graphicsOverlay.addGraphic(this.graphicPointAObj);
    //点B
    let graphicPointB = new GraphicPoint();
    this.graphicPointBObj = await graphicPointB.createObj();
    await this.graphicPointBObj.setPointAndSize(dotObj8, 10);
    await this.graphicPointBObj.setColor('rgba(51, 0, 255, 255)');
    await this.graphicsOverlay.addGraphic(this.graphicPointBObj);

    //刷新地图
    await this.mapView.refresh();
  }

  /**
   * 直线角度
   */
  anglePI = async () => {
    //初始化视图
    await this.initMapView();
    //突出显示目标对象
    await this.graphicPolylinAObj.setColor('rgba(255, 0, 0, 255)');
    //刷新地图
    await this.mapView.refresh();

    let dotArr = await this.graphicPolylinAObj.getPoints();

    let angleVal = await SpaCalculator.angle2PIOfDot(dotArr[0], dotArr[1]);
    angleVal = angleVal.toFixed(4);

    this.setState({
      calResult: '该直线角度为:' + angleVal + '度',
    });
  };

  /**
   *两点距离
   */
  distance1 = async () => {
    //初始化视图
    await this.initMapView();
    //突出显示两个目标对象
    await this.graphicPointAObj.setColor('rgba(255, 0, 0, 255)');
    await this.graphicPointBObj.setColor('rgba(255, 0, 0, 255)');

    let point1 = await this.graphicPointAObj.getPoint();
    let point2 = await this.graphicPointBObj.getPoint();

    let graphicPolylin = new GraphicPolylin();
    let graphicPolylinObj = await graphicPolylin.createObj();
    await graphicPolylinObj.appendPoint(point1);
    await graphicPolylinObj.appendPoint(point2);
    await graphicPolylinObj.setColor('rgba(255, 0, 0, 255)');
    await graphicPolylinObj.setLineWidth(2);
    await this.graphicsOverlay.addGraphic(graphicPolylinObj);
    //刷新地图
    await this.mapView.refresh();

    //计算两点距离
    let distanceVal = await SpaCalculator.distanceOfDot(point1, point2);
    distanceVal = distanceVal.toFixed(4);

    this.setState({
      calResult: '两点距离为:' + distanceVal + '米',
    });
  };

  /**
   *两区距离
   */
  distance2 = async () => {
    //初始化视图
    await this.initMapView();
    //突出显示两个目标对象
    await this.graphicPolygonAObj.setColor('rgba(255, 0, 0, 255)');
    await this.graphicPolygonBObj.setColor('rgba(255, 0, 0, 255)');
    //刷新地图
    await this.mapView.refresh();

    //将两个区图形转为几何对象
    let geo1 = await Graphic.toGeometry(this.graphicPolygonAObj);
    let geo2 = await Graphic.toGeometry(this.graphicPolygonBObj);
    /**
     * 计算两个几何对象间的距离
     *                 **********************************************************************************
     *                 *        	*     点    	 *     线     	  *  区(单圈) 	*   多线 		*     多区 		*
     *                 **********************************************************************************
     *                 *   点   		*   min|max  *    min     *  min|max  	*  不支持   	*  不支持   		*
     *                 *   线   		*     min    *  min|max   *  不支持  		*  不支持   	*  不支持   		*
     *                 *  区(单圈)  	*   min|max  *  不支持    	  *    min      *  不支持   	*  不支持   		*
     *                 *   多线 		*     min    *  min|max   *  不支持  		*  不支持   	*  不支持   		*
     *                 *   多区 		*   min|max  *  不支持    	  *    min    	*  不支持   	*  不支持   		*
     *                 **********************************************************************************
     *
     * @param geom1 几何对象1
     * @param geom2 几何对象2
     * @param type 计算距离方法
     * @return 距离长度
     */
    //计算两区距离
    let distanceVal = await SpaCalculator.distanceOfGeometry(geo1, geo2, 0);
    distanceVal = distanceVal.toFixed(4);

    this.setState({
      calResult: '两区最短距离为:' + distanceVal + '米',
    });
  };

  /**
   * 两线交点
   */
  calLinesInters = async () => {
    //初始化视图
    await this.initMapView();
    //突出显示两个目标对象
    await this.graphicPolylinAObj.setColor('rgba(255, 0, 0, 255)');
    await this.graphicPolylinBObj.setColor('rgba(255, 0, 0, 255)');
    //刷新地图
    await this.mapView.refresh();
    //取两条线的点序列
    let line1 = await this.graphicPolylinAObj.getPoints();
    let line2 = await this.graphicPolylinBObj.getPoints();

    let geoVarLineA = new GeoVarLine();
    let geoVarLineB = new GeoVarLine();
    let geoVarLineAObj = await geoVarLineA.createObj();
    let geoVarLineBObj = await geoVarLineB.createObj();

    for (let i = 0; i < line1.length; i++) {
      await geoVarLineAObj.append2D(line1[i]);
    }

    for (let i = 0; i < line2.length; i++) {
      await geoVarLineBObj.append2D(line2[i]);
    }

    //计算两条线的交点
    let points = await SpaCalculator.calLinesInters(
      geoVarLineAObj,
      geoVarLineBObj
    );

    //显示计算结果
    if (points != null) {
      for (let i = 0; i < points.length; i++) {
        let point = points[i];
        let pointX = await point.getX();
        let pointY = await point.getY();
        pointX = pointX.toFixed(4);
        pointY = pointY.toFixed(4);
        this.setState({
          calResult:
            '两线交点坐标为:' + '\n' + 'X:' + pointX + '\n' + 'Y:' + pointY,
        });
        let graphicPoint = new GraphicPoint();
        let graphicPointObj = await graphicPoint.createObj();
        await graphicPointObj.setPointAndSize(point, 10);
        await graphicPointObj.setColor('rgba(0, 0, 255, 255)');
        await this.graphicsOverlay.addGraphic(graphicPointObj);
      }
    } else {
      ToastAndroid.show('没有计算出结果', ToastAndroid.SHORT);
    }
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
          <View style={style.button}>
            <TouchableOpacity onPress={this.anglePI}>
              <Text style={style.text}>直线角度</Text>
            </TouchableOpacity>
          </View>
          <View style={style.button}>
            <TouchableOpacity onPress={this.distance1}>
              <Text style={style.text}>两点距离</Text>
            </TouchableOpacity>
          </View>
          <View style={style.button}>
            <TouchableOpacity onPress={this.distance2}>
              <Text style={style.text}>两区距离</Text>
            </TouchableOpacity>
          </View>
          <View style={style.button}>
            <TouchableOpacity onPress={this.calLinesInters}>
              <Text style={style.text}>两线交点</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.textView}>
          <View style={styles.itemSingleView}>
            <Text style={styles.itemKey}>空间计算结果:</Text>
            <Text style={styles.itemValue}>{this.state.calResult}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#fff',
  },
  button: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    margin: 2,
    marginTop: 10,
    borderRadius: 30,
    backgroundColor: 'rgba(245,83,61,0.8)',
  },
});
