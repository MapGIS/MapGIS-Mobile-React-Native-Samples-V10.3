import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  DeviceEventEmitter,
  ToastAndroid,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import {
  MGMapView,
  Dot,
  Rect,
  GraphicPolygon,
  Graphic,
  GraphicText,
  SpaRelation,
} from '@mapgis/mobile-react-native';

export default class MapSpatialRelation extends Component {
  static navigationOptions = { title: '空间关系' };

  constructor() {
    super();
    this.state = {
      selectIndex: -1,
      selectGraphicName: '',
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
    DeviceEventEmitter.addListener(
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
    let dotObj11 = await dot.createObj(12685623, 3594578);
    let dotObj12 = await dot.createObj(12685623, 3572194);
    //多边形A
    let dotArrA = [];
    dotArrA.push(dotObj1);
    dotArrA.push(dotObj2);
    dotArrA.push(dotObj3);
    dotArrA.push(dotObj4);
    dotArrA.push(dotObj5);
    dotArrA.push(dotObj1);
    let graphicPolygonA = new GraphicPolygon();
    this.graphicPolygonAObj = await graphicPolygonA.createObj();
    await this.graphicPolygonAObj.setPoints(dotArrA, null);
    await this.graphicPolygonAObj.setColor('rgba(255, 204, 0, 125)');
    await this.graphicPolygonAObj.setBorderlineColor('rgba(51, 51, 51, 255)');
    await this.graphicPolygonAObj.setBorderlineWidth(5);
    await this.graphicsOverlay.addGraphic(this.graphicPolygonAObj);
    //多边形B
    let dotArrB = [];
    dotArrB.push(dotObj6);
    dotArrB.push(dotObj7);
    dotArrB.push(dotObj8);
    dotArrB.push(dotObj6);
    let graphicPolygonB = new GraphicPolygon();
    this.graphicPolygonBObj = await graphicPolygonB.createObj();
    await this.graphicPolygonBObj.setPoints(dotArrB, null);
    await this.graphicPolygonBObj.setColor('rgba(50, 0, 255, 50)');
    await this.graphicPolygonBObj.setBorderlineColor('rgba(51, 51, 51, 255)');
    await this.graphicPolygonBObj.setBorderlineWidth(5);
    await this.graphicsOverlay.addGraphic(this.graphicPolygonBObj);
    //多边形C
    let dotArrC = [];
    dotArrC.push(dotObj4);
    dotArrC.push(dotObj6);
    dotArrC.push(dotObj9);
    dotArrC.push(dotObj10);
    dotArrC.push(dotObj4);
    let graphicPolygonC = new GraphicPolygon();
    this.graphicPolygonCObj = await graphicPolygonC.createObj();
    await this.graphicPolygonCObj.setPoints(dotArrC, null);
    await this.graphicPolygonCObj.setColor('rgba(50, 0, 255, 50)');
    await this.graphicPolygonCObj.setBorderlineColor('rgba(51, 51, 51, 255)');
    await this.graphicPolygonCObj.setBorderlineWidth(5);
    await this.graphicsOverlay.addGraphic(this.graphicPolygonCObj);
    //多边形D
    let dotArrD = [];
    dotArrD.push(dotObj1);
    dotArrD.push(dotObj2);
    dotArrD.push(dotObj12);
    dotArrD.push(dotObj11);
    dotArrD.push(dotObj1);
    let graphicPolygonD = new GraphicPolygon();
    this.graphicPolygonDObj = await graphicPolygonD.createObj();
    await this.graphicPolygonDObj.setPoints(dotArrD, null);
    await this.graphicPolygonDObj.setColor('rgba(50, 0, 255, 50)');
    await this.graphicPolygonDObj.setBorderlineColor('rgba(51, 51, 51, 255)');
    await this.graphicPolygonDObj.setBorderlineWidth(5);
    await this.graphicsOverlay.addGraphic(this.graphicPolygonDObj);

    let graphicText1 = new GraphicText();
    let graphicTextObj1 = await graphicText1.createObj();
    let dotObj13 = await dot.createObj(12733109.43, 3585761.96);
    await graphicTextObj1.setPoint(dotObj13);
    await graphicTextObj1.setText('A');
    await graphicTextObj1.setColor('rgba(255, 0, 0, 255)');
    await graphicTextObj1.setFontSize(50);
    await this.graphicsOverlay.addGraphic(graphicTextObj1);

    let graphicText2 = new GraphicText();
    let graphicTextObj2 = await graphicText2.createObj();
    let dotObj14 = await dot.createObj(12739914.3, 3575641.3);
    await graphicTextObj2.setPoint(dotObj14);
    await graphicTextObj2.setText('B');
    await graphicTextObj2.setColor('rgba(255, 0, 0, 255)');
    await graphicTextObj2.setFontSize(50);
    await this.graphicsOverlay.addGraphic(graphicTextObj2);

    let graphicText3 = new GraphicText();
    let graphicTextObj3 = await graphicText3.createObj();
    let dotObj15 = await this.graphicPolygonCObj.getCenterPoint();
    await graphicTextObj3.setPoint(dotObj15);
    await graphicTextObj3.setText('C');
    await graphicTextObj3.setColor('rgba(255, 0, 0, 255)');
    await graphicTextObj3.setFontSize(50);
    await this.graphicsOverlay.addGraphic(graphicTextObj3);

    let graphicText4 = new GraphicText();
    let graphicTextObj4 = await graphicText4.createObj();
    let dotObj16 = await this.graphicPolygonDObj.getCenterPoint();
    await graphicTextObj4.setPoint(dotObj16);
    await graphicTextObj4.setText('D');
    await graphicTextObj4.setColor('rgba(255, 0, 0, 255)');
    await graphicTextObj4.setFontSize(50);
    await this.graphicsOverlay.addGraphic(graphicTextObj4);

    //刷新地图
    await this.mapView.refresh();

    let spaRelation = new SpaRelation();
    this.spaRelationObj = await spaRelation.createObj();

    this.curGeometry1 = null;
    this.curGeometry2 = null;
  }

  //单选框设置服务类型
  onSelect = (index, value) => {
    this.setState({ selectIndex: index, selectGraphicName: value });

    //高亮显示选中的图形并转为几何对象
    this.selectedSpaGraphic(index);
  };

  /**
   * 空间关系判断
   */
  selectedSpaGraphic = async index => {
    //选中第二个分析图形时高亮显示此图形，并将此图形对象转为几何对象
    switch (index) {
      case 0:
        if (this.graphicPolygonBObj != null) {
          await this.graphicPolygonBObj.setColor('rgba(255, 204, 0, 125)');
          await this.graphicPolygonCObj.setColor('rgba(50, 0, 255, 50)');
          await this.graphicPolygonDObj.setColor('rgba(50, 0, 255, 50)');
          this.curGeometry2 = await Graphic.toGeometry(this.graphicPolygonBObj);
          this.setState({
            calResult: '',
          });
        }
        break;
      case 1:
        if (this.graphicPolygonCObj != null) {
          await this.graphicPolygonCObj.setColor('rgba(255, 204, 0, 125)');
          await this.graphicPolygonBObj.setColor('rgba(50, 0, 255, 50)');
          await this.graphicPolygonDObj.setColor('rgba(50, 0, 255, 50)');
          this.curGeometry2 = await Graphic.toGeometry(this.graphicPolygonCObj);
          this.setState({
            calResult: '',
          });
        }
        break;
      case 2:
        if (this.graphicPolygonDObj != null) {
          await this.graphicPolygonDObj.setColor('rgba(255, 204, 0, 125)');
          await this.graphicPolygonBObj.setColor('rgba(50, 0, 255, 50)');
          await this.graphicPolygonCObj.setColor('rgba(50, 0, 255, 50)');
          this.curGeometry2 = await Graphic.toGeometry(this.graphicPolygonDObj);
          this.setState({
            calResult: '',
          });
        }
        break;
      default:
        break;
    }
    await this.mapView.refresh();
  };

  /**
   * 空间关系判断
   */
  relation = async () => {
    //判断是否选中第二个图形进行分析
    if (this.curGeometry2 == null) {
      ToastAndroid.show(
        '请先在左侧列表选中另一个空间图形对象',
        ToastAndroid.SHORT
      );
      return;
    }
    //清除文字内容
    this.setState({
      calResult: '',
    });

    if (this.graphicPolygonAObj != null) {
      //将多边形图形转为几何对象进行分析
      this.curGeometry1 = await Graphic.toGeometry(this.graphicPolygonAObj);
    }

    if (this.curGeometry1 == null || this.curGeometry2 == null) {
      return;
    }

    //判断空间分析
    let relationRes = false;
    relationRes = await this.spaRelationObj.isContains(
      this.curGeometry1,
      this.curGeometry2
    );
    if (relationRes) {
      //判断一个图形是否包含另外一个图形
      this.setState({
        calResult: '包含;',
      });
    }
    relationRes = await this.spaRelationObj.isCrosses(
      this.curGeometry1,
      this.curGeometry2
    );
    if (relationRes) {
      //判断两个图形是否在维数较少的那个图形的内部相交
      this.setState({
        calResult: '相交;',
      });
    }
    relationRes = await this.spaRelationObj.isDisjoint(
      this.curGeometry1,
      this.curGeometry2
    );
    if (relationRes) {
      //判断两个图形间是否没有相同点
      this.setState({
        calResult: '相离;',
      });
    }
    relationRes = await this.spaRelationObj.isEquals(
      this.curGeometry1,
      this.curGeometry2
    );
    if (relationRes) {
      //判断两个图形是否是同一个类型并且在平面上的点是否是相同的位置。如果返回值为真，
      //则它们应该包含（Contains）另外一个图形同时也被另外一个图形所包含(Within)。
      this.setState({
        calResult: '相等;',
      });
    }
    relationRes = await this.spaRelationObj.isOverlaps(
      this.curGeometry1,
      this.curGeometry2
    );
    if (relationRes) {
      //判断两个图形的交集是否和其中的一个图形拥有相同的维数，并且他们交集不能和其中任何一个图形相等
      //该方法只使用与两个Polyline 之间或者两个Polygon 之间
      this.setState({
        calResult: '相覆盖;',
      });
    }
    relationRes = await this.spaRelationObj.isTouches(
      this.curGeometry1,
      this.curGeometry2
    );
    if (relationRes) {
      //判断两个图形的边界是否相交，如果两个图形的交集不为空，但两个图形内部的交集为空，则返回值为真
      this.setState({
        calResult: '相邻接;',
      });
    }
    relationRes = await this.spaRelationObj.isWithin(
      this.curGeometry1,
      this.curGeometry2
    );
    if (relationRes) {
      //判断两个图形的边界是否相交，如果两个图形的交集不为空，但两个图形内部的交集为空，则返回值为真
      this.setState({
        calResult: '被包含;',
      });
    }
    if (this.state.calResult === '') {
      this.setState({
        calResult: '未知类型',
      });
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
        <View style={style.allView}>
          <View style={style.graphicAView}>
            <Image style={style.imageStyle} source={{ uri: 'ic_check_box' }} />
            <Text style={[styles.text, { marginTop: 5 }]}>图形A</Text>
          </View>

          <RadioGroup
            style={style.radioGroup}
            color="#FFF"
            activeColor="#f5533d"
            selectedIndex={this.state.selectIndex}
            onSelect={(index, value) => this.onSelect(index, value)}
          >
            <RadioButton style={style.radioButton} value={'图形B'}>
              <Text style={styles.text}>图形B</Text>
            </RadioButton>
            <RadioButton style={style.radioButton} value={'图形C'}>
              <Text style={styles.text}>图形C</Text>
            </RadioButton>
            <RadioButton style={style.radioButton} value={'图形D'}>
              <Text style={styles.text}>图形D</Text>
            </RadioButton>
          </RadioGroup>

          <View style={style.buttons}>
            <View style={style.button}>
              <TouchableOpacity onPress={this.relation}>
                <Text style={styles.text}>空间关系判断</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.textView}>
            <View style={styles.itemSingleView}>
              <Text style={styles.itemKey}>请选择两个几何对象:</Text>
              <Text style={styles.itemValue}>图形A</Text>
              <Text style={[styles.itemValue, { marginLeft: 20 }]}>
                {this.state.selectGraphicName}
              </Text>
            </View>
          </View>
          <View style={styles.textView}>
            <View style={styles.itemSingleView}>
              <Text style={styles.itemKey}>空间关系判断结果:</Text>
              <Text style={styles.itemValue}>{this.state.calResult}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  allView: {
    width: Dimensions.get('window').width,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#292c36',
    alignSelf: 'flex-end',
  },
  graphicAView: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#292c36',
  },
  imageStyle: {
    width: 25,
    height: 25,
    marginLeft: 8,
    marginTop: 3,
  },
  radioGroup: {
    flexDirection: 'column',
    backgroundColor: '#292c36',
    justifyContent: 'flex-start',
  },
  radioButton: {
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  buttons: {
    width: Dimensions.get('window').width,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  button: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    marginRight: 5,
    borderRadius: 30,
    backgroundColor: 'rgba(245,83,61,0.8)',
  },
});
