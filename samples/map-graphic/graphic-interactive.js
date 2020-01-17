import React, { Component } from 'react';
import { View, Text, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import { TXTLIN_IMG_FILE_PATH } from '../utils';
import { IMG_FILE_PATH } from '../utils';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import {
  Rect,
  MGMapView,
  Dot,
  GraphicStippleLine,
  GraphicsOverlay,
  GraphicPoint,
  GraphicPolylin,
  Image,
  GraphicImage,
  PointF,
  GraphicText,
  GraphicCircle,
  GraphicPolygon,
} from '@mapgis/mobile-react-native';

export default class MapGraphicInterActive extends Component {
  static navigationOptions = { title: '交互绘制几何图形' };

  constructor() {
    super();
    this.state = {
      isChecked: false,
      drawType: -1,
      isFirstPoint: true,
      circleDotCount: 0,
      lineDotCnt: 0,
      points: [],
      dotLst: [],
    };
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(index) {
    this.setState({
      isChecked: true,
      drawType: index,
      isFirstPoint: true,
    });
    //判断图形是否绘制完成
    this.checkGraphicHasFinished();
  }

  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.registerMapLoadListener();
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
  };

  componentWillUnmount() {
    this.mapLoadListener.remove();
  }

  componentDidMount() {
    this.mapLoadListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.single_tap_event',
      async res => {
        let graphicPointModule = new GraphicPoint();
        let graphicPoint = await graphicPointModule.createObj();
        let dotModule = new Dot();
        let dot = await dotModule.createObj(res.x, res.y);
        await graphicPoint.setPointAndSize(dot, 5);

        switch (this.state.drawType) {
          case 0: //点
            await graphicPoint.setSize(15);
            await graphicPoint.setColor('rgba(255, 0, 0, 255)');
            // 将绘制的图形添加到GraphicsOverlay中
            await this.pointGraphicsOverlay.addGraphic(graphicPoint);
            await this.mapView.refresh();
            break;
          case 1: //圆
            if (this.state.circleDotCount === 2) {
              this.setState({ circleDotCount: 0 });
            }
            this.setState({ circleDotCount: ++this.state.circleDotCount });
            if (this.state.circleDotCount === 1) {
              this.setState({ points: [dot] });

              await graphicPoint.setSize(6);
              await graphicPoint.setColor('rgba(255, 0, 0, 255)');
              let graphicsOverlay = await this.mapView.getGraphicsOverlay();
              await graphicsOverlay.addGraphic(graphicPoint);
            } else if (this.state.circleDotCount === 2) {
              this.setState({ points: this.state.points.concat([dot]) });
              //计算半径
              let x0 = await this.state.points[0].getX();
              let y0 = await this.state.points[0].getY();
              let x1 = await this.state.points[1].getX();
              let y1 = await this.state.points[1].getY();

              let sqr = Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2);
              let radius = Math.pow(sqr, 0.5);
              //圆
              let graphicCircleModule = new GraphicCircle();
              let graphicCircle = await graphicCircleModule.createObj();

              await graphicCircle.setCenterAndRadius(
                this.state.points[0],
                radius
              );
              await graphicCircle.setColor('rgba( 255, 0, 0, 70)');
              await graphicCircle.setBorderlineWidth(5);
              await this.circleGraphicsOverlay.addGraphic(graphicCircle);
            }
            await this.mapView.refresh();
            break;
          case 2: //折线
            //绘制点
            await graphicPoint.setSize(10);
            await graphicPoint.setColor('rgba(255, 0, 0, 255)');
            let graphicsOverlay = await this.mapView.getGraphicsOverlay();
            await graphicsOverlay.addGraphic(graphicPoint);
            if (this.state.isFirstPoint) {
              //构造线
              let graphicPolylinModule = new GraphicPolylin();
              this.graphicPolylin = await graphicPolylinModule.createObj();
              await this.graphicPolylin.setColor('rgba( 0, 0, 255, 255)');
              await this.graphicPolylin.setLineWidth(10);
              await this.polylinGraphicsOverlay.addGraphic(this.graphicPolylin);
              await this.graphicPolylin.appendPoint(dot);
              this.setState({ isFirstPoint: false });
            } else {
              // 绘制线
              await this.graphicPolylin.appendPoint(dot);
            }
            await this.mapView.refresh();
            break;
          case 3: //虚线
            if (this.state.lineDotCnt === 2) {
              this.setState({ lineDotCnt: 0 });
            }
            this.setState({ lineDotCnt: ++this.state.lineDotCnt });
            await graphicPoint.setSize(8);
            await graphicPoint.setColor('rgba(255, 0, 0, 255)');
            let graphicsOverlayStippleLine = await this.mapView.getGraphicsOverlay();
            await graphicsOverlayStippleLine.addGraphic(graphicPoint);

            if (this.state.lineDotCnt === 1) {
              this.setState({ points: [dot] });
            } else if (this.state.lineDotCnt === 2) {
              this.setState({ points: this.state.points.concat([dot]) });

              let graphicStippleLineModule = new GraphicStippleLine();
              this.graphicStippleLine = await graphicStippleLineModule.createObj(
                this.state.points[0],
                this.state.points[1]
              );
              await this.graphicStippleLine.setColor('rgba(0, 200, 0, 255)');
              await this.graphicStippleLine.setLineWidth(15);
              await this.stippleLineGraphicsOverlay.addGraphic(
                this.graphicStippleLine
              );
            }
            await this.mapView.refresh();
            break;
          case 4: //纹理线
            await graphicPoint.setSize(4);
            await graphicPoint.setColor('rgba(0, 200, 0, 128)');
            let graphicsOverlaytextureLin = await this.mapView.getGraphicsOverlay();
            await graphicsOverlaytextureLin.addGraphic(graphicPoint);

            if (this.state.isFirstPoint) {
              //纹理线
              let graphicTextureLinModule = new GraphicPolylin();
              this.graphicTextureLin = await graphicTextureLinModule.createObj();
              let image = new Image();
              let bitmap1 = await image.createObjByLocalPath(
                TXTLIN_IMG_FILE_PATH
              );
              let height = await bitmap1.getHeight();
              await this.graphicTextureLin.setFillTexture(bitmap1);
              await this.graphicTextureLin.setLineWidth(height);
              await this.graphicTextureLin.appendPoint(dot);
              await this.texturelinGraphicsOverlay.addGraphic(
                this.graphicTextureLin
              );
              this.setState({ isFirstPoint: false });
            } else {
              await this.graphicTextureLin.appendPoint(dot);
            }
            await this.mapView.refresh();
            break;
          case 5: //多边形
            await graphicPoint.setSize(6);
            await graphicPoint.setColor('rgba(211, 0, 255, 205)');
            let graphicsOverlaypolygon = await this.mapView.getGraphicsOverlay();
            await graphicsOverlaypolygon.addGraphic(graphicPoint);
            if (this.state.isFirstPoint) {
              let graphicPolygonModule = new GraphicPolygon();
              this.graphicPolygon = await graphicPolygonModule.createObj();
              await this.graphicPolygon.setColor('rgba(0, 139, 0, 100)');
              await this.graphicPolygon.setBorderlineColor(
                'rgba(100, 200, 0, 90)'
              );
              await this.polygonGraphicsOverlay.addGraphic(this.graphicPolygon);
              this.setState({ dotLst: [dot], isFirstPoint: false });
            } else {
              this.setState({ dotLst: this.state.dotLst.concat([dot]) });
              if (this.state.dotLst.length > 2) {
                this.setState({
                  dotLst: this.state.dotLst.concat([this.state.dotLst[0]]),
                }); // 上层必须构建闭合的区
                await this.graphicPolygon.setPoints(this.state.dotLst, null);
              }
              if (this.state.dotLst.length > 3) {
                let count = (await this.graphicPolygon.getPointCount()) - 1;
                await this.graphicPolygon.removePoint(count);
                this.setState({
                  dotLst: this.state.dotLst.filter(
                    (_, i) => i !== this.state.dotLst.length - 1
                  ),
                });
              }
            }
            await this.mapView.refresh();
            break;
          case 6: //文本
            let graphicTextModule = new GraphicText();
            this.graphicText = await graphicTextModule.createObj();
            let textPointf = new PointF();
            let textAnchorPoint = await textPointf.createObj(0.5, 0.5);
            await this.graphicText.setAnchorPointByPoint(textAnchorPoint);
            await this.graphicText.setPoint(dot);
            await this.graphicText.setText('武汉');
            await this.graphicText.setFontSize(40);
            await this.graphicText.setSlope(true);
            await this.textGraphicsOverlay.addGraphic(this.graphicText);
            await this.mapView.refresh();
            break;
          case 7: //图像
            let image = new Image();
            let img = await image.createObjByLocalPath(IMG_FILE_PATH);
            let gi = new GraphicImage();
            this.graphicImage = await gi.createObj();
            await this.graphicImage.setImage(img);
            await this.graphicImage.setPoint(dot);
            await this.graphicImage.setSlope(true);
            let pointf = new PointF();
            let anchorPoint = await pointf.createObj(0.5, 0.5);
            await this.graphicImage.setAnchorPoint(anchorPoint);
            await this.imgageGraphicsOverlay.addGraphic(this.graphicImage);
            await this.mapView.refresh();
            break;
          default:
            break;
        }
      }
    );

    DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.LoadMapListener_Start',
      async () => {}
    );

    DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.LoadMapListener_Fail',
      async () => {}
    );

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

          //创建覆盖物图层，并添加到地图视图覆盖物图层列表中
          let pointGraphicsOverlayModule = new GraphicsOverlay();
          this.pointGraphicsOverlay = await pointGraphicsOverlayModule.createObj();

          let circleGraphicsOverlayModule = new GraphicsOverlay();
          this.circleGraphicsOverlay = await circleGraphicsOverlayModule.createObj();

          let polylinGraphicsOverlayModule = new GraphicsOverlay();
          this.polylinGraphicsOverlay = await polylinGraphicsOverlayModule.createObj();

          let stippleLineGraphicsOverlayModule = new GraphicsOverlay();
          this.stippleLineGraphicsOverlay = await stippleLineGraphicsOverlayModule.createObj();

          let texturelinGraphicsOverlayModule = new GraphicsOverlay();
          this.texturelinGraphicsOverlay = await texturelinGraphicsOverlayModule.createObj();

          let polygonGraphicsOverlayModule = new GraphicsOverlay();
          this.polygonGraphicsOverlay = await polygonGraphicsOverlayModule.createObj();

          let textGraphicsOverlayModule = new GraphicsOverlay();
          this.textGraphicsOverlay = await textGraphicsOverlayModule.createObj();

          let imgageGraphicsOverlayModule = new GraphicsOverlay();
          this.imgageGraphicsOverlay = await imgageGraphicsOverlayModule.createObj();

          let graphicsOverlays = await this.mapView.getGraphicsOverlays();
          await graphicsOverlays.add(this.pointGraphicsOverlay);
          await graphicsOverlays.add(this.circleGraphicsOverlay);
          await graphicsOverlays.add(this.polylinGraphicsOverlay);
          await graphicsOverlays.add(this.stippleLineGraphicsOverlay);
          await graphicsOverlays.add(this.texturelinGraphicsOverlay);
          await graphicsOverlays.add(this.polygonGraphicsOverlay);
          await graphicsOverlays.add(this.textGraphicsOverlay);
          await graphicsOverlays.add(this.imgageGraphicsOverlay);
        }
      }
    );
  }

  startGraphic = async () => {
    await this.mapView.unregisterTapListener();
    await this.mapView.registerTapListener();

    if (!this.state.isChecked) {
      this.setState({ drawType: 1 });
    }
  };

  stopGraphic = async () => {
    await this.mapView.unregisterTapListener();
    //判断图形是否绘制完成
    this.checkGraphicHasFinished();
  };

  clearGraphic = async () => {
    let graphicsOverlay = await this.mapView.getGraphicsOverlay();
    await graphicsOverlay.removeAllGraphics();
    await this.pointGraphicsOverlay.removeAllGraphics();
    await this.circleGraphicsOverlay.removeAllGraphics();
    await this.polylinGraphicsOverlay.removeAllGraphics();
    await this.stippleLineGraphicsOverlay.removeAllGraphics();
    await this.texturelinGraphicsOverlay.removeAllGraphics();
    await this.polygonGraphicsOverlay.removeAllGraphics();
    await this.textGraphicsOverlay.removeAllGraphics();
    await this.imgageGraphicsOverlay.removeAllGraphics();
    await this.mapView.refresh();

    this.setState({ isFirstPoint: true });
  };

  checkGraphicHasFinished = async () => {
    //判断圆图形是否绘制完成：未绘制完成则进行相关处理
    if (this.state.circleDotCount === 1) {
      await this.mapView
        .getGraphicsOverlay()
        .removeGraphic(
          (await this.mapView.getGraphicsOverlay().getGraphicCount()) - 1
        );
    }
    //保证圆图形正确重新绘制
    this.setState({ circleDotCount: 0 });

    //判断虚线是否绘制完成
    if (this.state.lineDotCnt === 1) {
      await this.mapView
        .getGraphicsOverlay()
        .removeGraphic(
          (await this.mapView.getGraphicsOverlay().getGraphicCount()) - 1
        );
    }
    this.setState({ lineDotCnt: 0 });

    //多边形是否绘制完成处理
    if (this.graphicPolygon != null) {
      if (this.state.dotLst.length === 1) {
        await this.mapView
          .getGraphicsOverlay()
          .removeGraphic(
            (await this.mapView.getGraphicsOverlay().getGraphicCount()) - 1
          );
        await this.polygonGraphicsOverlay.removeGraphic(
          (await this.polygonGraphicsOverlay.getGraphicCount()) - 1
        );
        this.graphicPolygon = null;
      }
      if (this.state.dotLst.length === 2) {
        await this.mapView
          .getGraphicsOverlay()
          .removeGraphic(
            (await this.mapView.getGraphicsOverlay().getGraphicCount()) - 1
          );
        await this.mapView
          .getGraphicsOverlay()
          .removeGraphic(
            (await this.mapView.getGraphicsOverlay().getGraphicCount()) - 1
          );
        await this.polygonGraphicsOverlay.removeGraphic(
          (await this.polygonGraphicsOverlay.getGraphicCount()) - 1
        );
        this.graphicPolygon = null;
      }
    }
    //线、折线是否绘制完成处理
    if (
      this.graphicPolylin != null &&
      (await this.graphicPolylin.getPointCount()) === 1
    ) {
      await this.mapView
        .getGraphicsOverlay()
        .removeGraphic(
          (await this.mapView.getGraphicsOverlay().getGraphicCount()) - 1
        );
      this.graphicPolylin = null;
    }
    if (
      this.graphicTextureLin != null &&
      (await this.graphicTextureLin.getPointCount()) === 1
    ) {
      await this.mapView
        .getGraphicsOverlay()
        .removeGraphic(
          (await this.mapView.getGraphicsOverlay().getGraphicCount()) - 1
        );
      this.graphicTextureLin = null;
    }
    this.setState({ isFirstPoint: true });
    await this.mapView.refresh();
  };
  render() {
    return (
      <View style={styles.container}>
        <RadioGroup
          style={[styles.controls, { height: 100 }]}
          color="#FFF"
          activeColor="#f5533d"
          onSelect={index => this.onSelect(index)}
        >
          <RadioButton style={styles.control} value={'item1'}>
            <Text style={styles.label}>点</Text>
          </RadioButton>
          <RadioButton style={styles.control} value={'item2'}>
            <Text style={styles.label}>圆</Text>
          </RadioButton>
          <RadioButton style={styles.control} value={'item3'}>
            <Text style={styles.label}>线</Text>
          </RadioButton>
          <RadioButton style={styles.control} value={'item3'}>
            <Text style={styles.label}>虚线</Text>
          </RadioButton>
          <RadioButton style={styles.control} value={'item3'}>
            <Text style={styles.label}>纹理线</Text>
          </RadioButton>
          <RadioButton style={styles.control} value={'item3'}>
            <Text style={styles.label}>多边形</Text>
          </RadioButton>
          <RadioButton style={styles.control} value={'item3'}>
            <Text style={styles.label}>文本</Text>
          </RadioButton>
          <RadioButton style={styles.control} value={'item3'}>
            <Text style={styles.label}>图像</Text>
          </RadioButton>
        </RadioGroup>
        <MGMapView
          ref="mapView"
          onGetInstance={this.onGetInstance}
          style={styles.mapView}
        />
        <View style={[styles.buttons, { bottom: 80 }]}>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.startGraphic}>
              <Text style={styles.text}>开启绘制</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.stopGraphic}>
              <Text style={styles.text}>停止绘制</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.clearGraphic}>
              <Text style={styles.text}>清除图形</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
