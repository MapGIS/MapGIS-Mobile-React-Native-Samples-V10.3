import React, { Component, useDebugValue } from 'react';
import styles from '../styles';
import {
  MGMapView,
  Rect,
  SketchDataType,
  SketchEditor,
  GeometryType,
  PntInfo,
  Feature,
  LinInfo,
  RegInfo,
  FeatureEdit,
  Dot,
  GraphicPolygon,
  FeatureQuery,
  QueryBound,
  PointF,
} from '@mapgis/mobile-react-native';
import { FEATURE_EDIT_MAPX_PATH } from '../utils';

import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  DeviceEventEmitter,
  ToastAndroid,
  Dimensions,
  Picker,
  Alert,
  Modal,
} from 'react-native';
import { TextInput, FlatList } from 'react-native-gesture-handler';
/**
 * @content 离线要素编辑(草图交互)
 * @author xiaoying 2020-01-13 下午 7:06:20
 */

export default class DocLayerEditSketchDemo extends Component {
  static navigationOptions = { title: '离线要素编辑(草图交互)' };

  constructor() {
    super();
    this.state = {
      arrList: null,

      modalVisible: false,
      inputTextName1: '',
      inputTextValue1: '',
      inputTextName2: '',
      inputTextValue2: '',
      inputTextName3: '',
      inputTextValue3: '',
      inputTextName4: '',
      inputTextValue4: '',

      sketchEditor: null,
      selectedValue: '',
      pickerData: [],
      addFeature: null,
      deleteFeature: null,
      modifyFeature: null,
      modifyFeatureID: -1,

      isClickPointBt: false,
      isClickLineBt: false,
      isClickPolygonBt: true,

      geoModify: null,
      geoType: -1,

      vectorLayer: null,
    };
  }
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.registerMapLoadListener();
    await this.mapView.loadFromFile(FEATURE_EDIT_MAPX_PATH);
    this.map = await this.mapView.getMap();
  };

  componentDidMount() {
    // geometry_changed
    this.geometryChangedListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.SketchEditor.geometry_changed',
      async res => {
        console.log('geometry_changed_SketchEditorId: ' + res.SketchEditorId);
      }
    );

    // vertex_selected
    this.vertexSelectedListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.SketchEditor.vertex_selected',
      async res => {
        let { point2DId, point2DId1, point2DId2 } = res;
        if (point2DId !== null) {
          console.log('vertex_selected_point2DId: ' + point2DId);
        }

        if (point2DId1 !== null) {
          console.log('vertex_selected_point2DId1: ' + point2DId1);
        }

        if (point2DId2 !== null) {
          console.log('vertex_selected_point2DId2: ' + point2DId2);
        }
      }
    );

    // undo_state_changed
    this.undoStateChangedListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.SketchEditor.undo_state_changed',
      async res => {
        console.log('undo: ' + res.undoResult);
      }
    );

    // redo_state_changed
    this.redoStateChangeListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.SketchEditor.redo_state_changed',
      async res => {
        console.log('redo: ' + res.redoResult);
      }
    );

    this.mapLoadListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.LoadMapListener_Finish',
      async res => {
        if (res.DidFinishLoadingMap) {
          ToastAndroid.show('地图加载完成', ToastAndroid.SHORT);

          let rectModule = new Rect();
          let rect = await rectModule.createObj(
            12705276.572663,
            3542912.332349,
            12746062.17078,
            3607262.942711
          );

          await this.mapView.zoomToRange(rect, false);
          this.initLayerData();
          this.initSketchEditor();
        } else {
          ToastAndroid.show('地图加载失败', ToastAndroid.SHORT);
        }
      }
    );

    this.mapTapListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.single_tap_event',
      res => {
        this.tapMapView(res);
      }
    );
  }

  componentWillUnmount = () => {
    this.geometryChangedListener.remove();
    this.vertexSelectedListener.remove();
    this.undoStateChangedListener.remove();
    this.redoStateChangeListener.remove();
    this.mapLoadListener.remove();
    this.mapTapListener.remove();
  };

  // 初始化草图编辑器
  initSketchEditor = async () => {
    let sketchEditorModule = new SketchEditor();
    let sketchEditor1 = await sketchEditorModule.createObj(this.mapView);
    this.setState({ sketchEditor: sketchEditor1 });
    // 注册草图编辑器改变监听
    await this.state.sketchEditor.addStateChangedListener();
  };

  /**
   *开始草图编辑
   *
   * @memberof SketchEditorDemo
   * @param sketchDataType 草图编辑数据类型
   */
  startSketchEdit = async sketchDataType => {
    if (this.state.sketchEditor !== null) {
      await this.state.sketchEditor.startByType(sketchDataType);
    }
  };

  /**
   * 添加顶点
   *
   * @memberof SketchEditorDemo
   * @param x
   * @param y
   */
  addSketchVertex = async (x, y) => {
    if (this.state.sketchEditor !== null) {
      await this.state.sketchEditor.addVertex(x, y);
    }
  };

  // 删除当前被选中的顶点
  deleteSketchSelectedVertex = async () => {
    if (this.state.sketchEditor !== null) {
      await this.state.sketchEditor.deleteSelectedVertex();
    }
  };

  // 停止编辑
  stopSketchEdit = async () => {
    if (this.state.sketchEditor !== null) {
      await this.state.sketchEditor.stop();
    }
  };

  // 撤销
  undoSketchEdit = async () => {
    if (this.state.sketchEditor !== null) {
      await this.state.sketchEditor.undo();
    }
  };

  // 重做
  redoSketchEdit = async () => {
    if (this.state.sketchEditor !== null) {
      await this.state.sketchEditor.redo();
    }
  };

  // 清楚当前编辑的几何
  clearGeometrySketchEdit = async () => {
    if (this.state.sketchEditor !== null) {
      await this.state.sketchEditor.clearGeometry();
    }
  };

  // 改变图层下拉框
  changePickerValue = (itemValue, itemIndex) => {
    switch (itemValue) {
      case '自绘区':
        this.setState({
          selectedValue: itemValue,
          isClickPointBt: false,
          isClickLineBt: false,
          isClickPolygonBt: true,
        });

        break;
      case '自绘线':
        this.setState({
          selectedValue: itemValue,
          isClickPointBt: false,
          isClickLineBt: true,
          isClickPolygonBt: false,
        });

        break;
      case '自绘点':
        this.setState({
          selectedValue: itemValue,
          isClickPointBt: true,
          isClickLineBt: false,
          isClickPolygonBt: false,
        });

        break;
      default:
        this.setState({ selectedValue: itemValue });
        break;
    }

    this.initReference(itemValue);
  };

  initReference = async selectedValue => {
    let index = await this.map.indexOfByName(selectedValue);

    let map = await this.mapView.getMap();

    let vLayer = await map.getLayer(index);

    this.setState({
      vectorLayer: vLayer,
      addFeature: null,
      deleteFeature: null,
      modifyFeature: null,
    });

    // 清除草图编辑器绘制的图形
    this.clearGeometrySketchEdit();

    await (await this.mapView.getGraphicsOverlay()).removeAllGraphics();
    await this.mapView.refresh();
  };

  // 初始化图层下拉框，只显示自绘区、自绘线、自绘点图层
  initLayerData = async () => {
    let selectedValue = '';
    if (this.map != null) {
      let data = [];
      let count = await this.map.getLayerCount();
      for (let i = 0; i < count; i++) {
        let layer = await this.map.getLayer(i);
        let layerName = await layer.getName();
        if (
          layerName === '自绘区' ||
          layerName === '自绘线' ||
          layerName === '自绘点'
        ) {
          data.push(layerName);
        }
      }
      let size = data.length;
      if (size > 0) {
        selectedValue = data[0];
      }
      this.setState({ selectedValue: selectedValue, pickerData: data });
    }

    this.initReference(selectedValue);
  };

  // 保存要素对话框
  saveFeature = async () => {
    let geometry = await this.state.sketchEditor.getGeometry();
    if (geometry === null || geometry === undefined) {
      ToastAndroid.show('请先用草图工具绘制要素', ToastAndroid.SHORT);
    } else {
      Alert.alert('保存', '是否将此要素添加到数据中？', [
        {
          text: '是',
          onPress: () => {
            this.startSaveFeature();
          },
        },
        {
          text: '否',
          onPress: () => {
            this.stopSketchEdit();
          },
        },
      ]);
    }
  };

  // 保存要素
  startSaveFeature = async () => {
    this.setState({ addFeature: null });
    let geometry = await this.state.sketchEditor.getGeometry();
    let geoType = await geometry.getType();

    let feature = null;
    let geoTypeName = '点';
    // 多点
    if (geoType === GeometryType.GeoPoints) {
      geoTypeName = '点';
      // 属性
      let attribute = [];
      attribute.push('Name', '自定义点1');

      //添加点
      let pntInfoModule = new PntInfo();
      let pntInfo = await pntInfoModule.createObj();
      await pntInfo.setSymID(14);
      await pntInfo.setHeight(500);
      await pntInfo.setWidth(500);
      await pntInfo.setOutClr1(3);

      let featureModule = new Feature();
      feature = await featureModule.createObjByParam(
        attribute,
        geometry,
        pntInfo
      );
    } else if (geoType === GeometryType.GeoVarLine) {
      geoTypeName = '线';
      // 属性
      let attribute = [];
      attribute.push('Name_chn', '自定义线1');

      //添加点
      let linInfoModule = new LinInfo();
      let linInfo = await linInfoModule.createObj();
      await linInfo.setOutClr1(5);

      let featureModule = new Feature();
      feature = await featureModule.createObjByParam(
        attribute,
        geometry,
        linInfo
      );
    } else if (geoType === GeometryType.GeoLines) {
      geoTypeName = '线';
      // 属性
      let attribute = [];
      attribute.push('Name_chn', '自定义线1');

      //添加点
      let linInfoModule = new LinInfo();
      let linInfo = await linInfoModule.createObj();
      await linInfo.setOutClr1(5);

      let featureModule = new Feature();
      feature = await featureModule.createObjByParam(
        attribute,
        geometry,
        linInfo
      );
    } else if (geoType === GeometryType.GeoPolygon) {
      geoTypeName = '区';
      // 属性
      let attribute = [];
      attribute.push('Name', '自定义区1');

      //添加点
      let regInfoModule = new RegInfo();
      let regInfo = await regInfoModule.createObj();
      await regInfo.setFillClr(7);

      let featureModule = new Feature();
      feature = await featureModule.createObjByParam(
        attribute,
        geometry,
        regInfo
      );
    } else if (geoType === GeometryType.GeoPolygons) {
      geoTypeName = '区';
      // 属性
      let attribute = [];
      attribute.push('Name', '自定义区1');

      //添加点
      let regInfoModule = new RegInfo();
      let regInfo = await regInfoModule.createObj();
      await regInfo.setFillClr(7);

      let featureModule = new Feature();
      feature = await featureModule.createObjByParam(
        attribute,
        geometry,
        regInfo
      );
    }

    this.setState({ addFeature: feature });
    if (this.state.addFeature != null) {
      let featureAppendEditModule = new FeatureEdit();
      let featureAppendEdit = await featureAppendEditModule.createObjByVectorLayer(
        this.state.vectorLayer
      );

      let result = await featureAppendEdit.append(this.state.addFeature);
      if (result > 0) {
        ToastAndroid.show(
          '添加' + geoTypeName + ',' + result + '成功！',
          ToastAndroid.SHORT
        );
        await this.mapView.forceRefresh();
      } else {
        ToastAndroid.show('添加' + geoTypeName + '失败！', ToastAndroid.SHORT);
      }
    }

    this.stopSketchEdit();
  };

  // 删除要素对话框
  deleteFeature = async () => {
    if (this.state.deleteFeature != null) {
      Alert.alert('删除', '是否要删除此要素？', [
        {
          text: '是',
          onPress: () => {
            this.startDeleteFeature();
          },
        },
        { text: '否', onPress: () => {} },
      ]);
    } else {
      ToastAndroid.show('请点击选择删除的要素！', ToastAndroid.SHORT);
      await this.mapView.registerTapListener();
    }
  };

  // 地图点击事件
  tapMapView = async res => {
    this.setState({ modifyFeature: null });
    await (await this.mapView.getGraphicsOverlay()).removeAllGraphics();

    // 得到四个坐标
    let dotModule = new Dot();
    let dot1 = await dotModule.createObj(res.x - 40, res.y - 30);
    let dot2 = await dotModule.createObj(res.x - 40, res.y + 30);
    let dot3 = await dotModule.createObj(res.x + 40, res.y - 30);
    let dot4 = await dotModule.createObj(res.x + 40, res.y + 30);

    // 绘制多边形
    let graphicPolygonModule = new GraphicPolygon();
    let graphicPolygon = await graphicPolygonModule.createObj();
    await graphicPolygon.appendPoint(dot1);
    await graphicPolygon.appendPoint(dot2);
    await graphicPolygon.appendPoint(dot4);
    await graphicPolygon.appendPoint(dot3);
    await graphicPolygon.appendPoint(dot1);
    await graphicPolygon.setColor('rgba(0, 0, 255, 150)');

    await (await this.mapView.getGraphicsOverlay()).addGraphic(graphicPolygon);
    await this.mapView.refresh();

    //创建查询范围
    let rectModule = new Rect();
    let rect = await rectModule.createObj(
      res.x - 40,
      res.y - 30,
      res.x + 40,
      res.y + 30
    );

    // 查询。得到Feature
    let featureQueryModule = new FeatureQuery();
    let featureQuery = await featureQueryModule.createObjByVectorLayer(
      this.state.vectorLayer
    );

    let queryBoundModule = new QueryBound();
    let queryBound = await queryBoundModule.createObjByRect(rect);
    await featureQuery.setQueryBound(queryBound);
    await featureQuery.setPageSize(20);
    await featureQuery.setSpatialFilterRelationship(0);

    let featurePagedResult = await featureQuery.query();
    let featureLst = await featurePagedResult.getPage(1);
    if (featureLst.length > 0) {
      let feature = featureLst[0];
      let featureID = await feature.getID();
      this.setState({
        deleteFeature: feature,
        modifyFeature: feature,
        modifyFeatureID: featureID,
      });

      let geoM = await this.state.modifyFeature.getGeometry();
      let geoT = await geoM.getType();

      this.setState({ geoModify: geoM, geoType: geoT });

      let graphicList = await this.state.deleteFeature.toGraphics(); //转换成图形
      let graphicOverlay = await this.mapView.getGraphicsOverlay();
      await graphicOverlay.addGraphics(graphicList);
      await this.mapView.refresh();
    } else {
      ToastAndroid.show('继续查询', ToastAndroid.SHORT);
    }
  };

  // 开始删除要素
  startDeleteFeature = async () => {
    if (this.state.deleteFeature !== null) {
      let featureDeleteEditModule = new FeatureEdit();
      let featureDeleteEdit = await featureDeleteEditModule.createObjByVectorLayer(
        this.state.vectorLayer
      );
      let id = await this.state.deleteFeature.getID();

      let result = await featureDeleteEdit.delete(id);
      if (result > 0) {
        await (await this.mapView.getGraphicsOverlay()).removeAllGraphics();
        await this.mapView.forceRefresh();
        this.setState({ deleteFeature: null, modifyFeature: null });
      } else {
        ToastAndroid.show('删除失败', ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('要素为null', ToastAndroid.SHORT);
    }
  };

  // 修改属性
  modifyAttr = async () => {
    if (this.state.modifyFeature !== null) {
      let attribute = await this.state.modifyFeature.getAttributes();
      if (this.state.geoType === GeometryType.GeoPoints) {
        let attrArray = JSON.parse(attribute);

        let objPoint1 = { id: 0, Key: 'Name', Value: attrArray.Name };
        let objPoint2 = { id: 1, Key: 'Address', Value: attrArray.Address };
        let objPoint3 = { id: 2, Key: 'mpLayer', Value: attrArray.mpLayer };

        let listData = [];
        listData.push(objPoint1);
        listData.push(objPoint2);
        listData.push(objPoint3);
        this.setState({ arrList: listData });
        this.setModalVisible(true);
      } else if (
        this.state.geoType === GeometryType.GeoVarLine ||
        this.state.geoType === GeometryType.GeoLines
      ) {
        let attrArray = JSON.parse(attribute);
        let obj1 = { id: 0, Key: 'Name_chn', Value: attrArray.Name_chn };
        let obj2 = { id: 1, Key: 'Name_py', Value: attrArray.Name_py };
        let listData = [];
        listData.push(obj1);
        listData.push(obj2);
        this.setState({ arrList: listData });
        this.setModalVisible(true);
      } else if (
        this.state.geoType === GeometryType.GeoPolygon ||
        this.state.geoType === GeometryType.GeoPolygons
      ) {
        let attrArray = JSON.parse(attribute);

        let obj1 = { id: 0, Key: 'Name', Value: attrArray.Name };
        let obj2 = { id: 1, Key: 'mpLayer', Value: attrArray.mpLayer };

        let listData = [];
        listData.push(obj1);
        listData.push(obj2);
        this.setState({ arrList: listData });
        this.setModalVisible(true);
      }
    } else {
      ToastAndroid.show('请点击选择要修改的要素！', ToastAndroid.SHORT);
      await this.mapView.registerTapListener();
    }
  };

  startModifyAttr = async () => {};

  // 修改样式
  modifyInfo = async () => {
    if (this.state.modifyFeature === null) {
      ToastAndroid.show('请点击选择要修改的要素！', ToastAndroid.SHORT);
      await this.mapView.registerTapListener();
    } else {
      if (this.state.geoType === GeometryType.GeoPoints) {
        let pntInfo = await this.state.modifyFeature.getInfo();
        let height = await pntInfo.getHeight();
        let width = await pntInfo.getWidth();
        let symId = await pntInfo.getSymID();
        let color = await pntInfo.getOutClr1();

        let listData = [];
        let obj1 = { id: 0, Key: '符号编号', Value: String(symId) };
        let obj2 = { id: 1, Key: '颜色', Value: String(color) };
        let obj3 = { id: 2, Key: '高度', Value: String(height) };
        let obj4 = { id: 3, Key: '宽度', Value: String(width) };
        listData.push(obj1);
        listData.push(obj2);
        listData.push(obj3);
        listData.push(obj4);
        this.setState({ arrList: listData });
        this.setModalVisible(true);
      } else if (
        this.state.geoType === GeometryType.GeoVarLine ||
        this.state.geoType === GeometryType.GeoLines
      ) {
        let linInfo = await this.state.modifyFeature.getInfo();

        let color = await linInfo.getOutClr1();

        let listData = [];
        let obj1 = { id: 0, Key: '线颜色', Value: String(color) };

        listData.push(obj1);

        this.setState({ arrList: listData });
        this.setModalVisible(true);
      } else if (
        this.state.geoType === GeometryType.GeoPolygon ||
        this.state.geoType === GeometryType.GeoPolygons
      ) {
        let regInfo = await this.state.modifyFeature.getInfo();
        let fillMode = await regInfo.getFillMode();
        let color = await regInfo.getFillClr();

        let listData = [];
        let obj1 = { id: 1, Key: '填充颜色', Value: String(color) };
        let obj2 = { id: 0, Key: '填充模式', Value: String(fillMode) };

        listData.push(obj1);
        listData.push(obj2);

        this.setState({ arrList: listData });
        this.setModalVisible(true);
      }
    }
  };

  // 修改几何
  modifyGeometry = async () => {};

  // 设置修改属性对话框的可见性
  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  renderItem = item => {
    return (
      <View style={{ marginLeft: 20 }}>
        <Text>{item.Key}</Text>
        <TextInput
          multiline={false}
          autoCorrect={true}
          autoFocus={false}
          autoCapitalize="none"
          maxLength={1000}
          value={item.Value}
          onEndEditing={() => {}}
        />
      </View>
    );
  };

  renderListHeader = () => {
    return (
      <View>
        <Text style={style.itemTitle}>输入修改的参数</Text>
        <View style={style.separator} />
      </View>
    );
  };

  renderListFooter = () => {
    return (
      <View style={style.referenceView}>
        <TouchableOpacity
          style={style.modalButton}
          onPress={() => {
            this.startModifyAttr();
          }}
        >
          <Text style={{ fontSize: 17, color: '#62b3ff' }}>确定</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={style.modalButton}
          onPress={() => {
            this.setModalVisible(false);
          }}
        >
          <Text style={{ fontSize: 17, color: '#000' }}>取消</Text>
        </TouchableOpacity>
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
        <View style={[styles.buttons, { backgroundColor: '#000' }]}>
          <View style={style.touchViewParent}>
            <TouchableOpacity
              style={style.touchView}
              onPress={() => {
                if (this.state.isClickLineBt) {
                  this.startSketchEdit(SketchDataType.FREEHAND_LINE);
                } else {
                  ToastAndroid.show('请选择线图层', ToastAndroid.SHORT);
                }
              }}
            >
              <View style={style.imageParentView}>
                <Image
                  style={style.imageStyle}
                  source={{ uri: 'ic_action_freehand_line' }}
                />
              </View>
              <Text style={style.imageText}>流状线</Text>
            </TouchableOpacity>
          </View>

          <View style={style.touchViewParent}>
            <TouchableOpacity
              style={style.touchView}
              onPress={() => {
                if (this.state.isClickPolygonBt) {
                  this.startSketchEdit(SketchDataType.FREEHAND_POLYGON);
                } else {
                  ToastAndroid.show('请选择区图层', ToastAndroid.SHORT);
                }
              }}
            >
              <View style={style.imageParentView}>
                <Image
                  style={style.imageStyle}
                  source={{ uri: 'ic_action_freehand_polygon' }}
                />
              </View>
              <Text style={style.imageText}>流状区</Text>
            </TouchableOpacity>
          </View>

          <View style={style.touchViewParent}>
            <TouchableOpacity
              style={style.touchView}
              onPress={() => {
                if (this.state.isClickPointBt) {
                  this.startSketchEdit(SketchDataType.POINT);
                } else {
                  ToastAndroid.show('请选择点图层', ToastAndroid.SHORT);
                }
              }}
            >
              <View style={style.imageParentView}>
                <Image
                  style={style.imageStyle}
                  source={{ uri: 'ic_action_point' }}
                />
              </View>
              <Text style={style.imageText}>点</Text>
            </TouchableOpacity>
          </View>

          <View style={style.touchViewParent}>
            <TouchableOpacity
              style={style.touchView}
              onPress={() => {
                if (this.state.isClickPointBt) {
                  this.startSketchEdit(SketchDataType.MULTIPOINT);
                } else {
                  ToastAndroid.show('请选择点图层', ToastAndroid.SHORT);
                }
              }}
            >
              <View style={style.imageParentView}>
                <Image
                  style={style.imageStyle}
                  source={{ uri: 'ic_action_multi_point' }}
                />
              </View>
              <Text style={style.imageText}>多点</Text>
            </TouchableOpacity>
          </View>

          <View style={style.touchViewParent}>
            <TouchableOpacity
              style={style.touchView}
              onPress={() => {
                if (this.state.isClickLineBt) {
                  this.startSketchEdit(SketchDataType.POLYLINE);
                } else {
                  ToastAndroid.show('请选择线图层', ToastAndroid.SHORT);
                }
              }}
            >
              <View style={style.imageParentView}>
                <Image
                  style={style.imageStyle}
                  source={{ uri: 'ic_action_polyline' }}
                />
              </View>
              <Text style={style.imageText}>线</Text>
            </TouchableOpacity>
          </View>

          <View style={style.touchViewParent}>
            <TouchableOpacity
              style={style.touchView}
              onPress={() => {
                if (this.state.isClickPolygonBt) {
                  this.startSketchEdit(SketchDataType.POLYGON);
                } else {
                  ToastAndroid.show('请选择区图层', ToastAndroid.SHORT);
                }
              }}
            >
              <View style={style.imageParentView}>
                <Image
                  style={style.imageStyle}
                  source={{ uri: 'ic_action_polygon' }}
                />
              </View>
              <Text style={style.imageText}>区</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
          }}
        >
          <View style={style.modalView}>
            <FlatList
              ListHeaderComponent={this.renderListHeader}
              ListFooterComponent={this.renderListFooter}
              data={this.state.arrList}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => this.renderItem(item)}
              ItemSeparatorComponent={this._separator}
            />
          </View>
        </Modal>

        <View
          style={[styles.buttons, { backgroundColor: '#000', marginTop: 50 }]}
        >
          <View style={style.touchViewParent}>
            <TouchableOpacity
              style={style.touchView}
              onPress={() => {
                this.addSketchVertex(12735784, 3563488);
              }}
            >
              <View style={style.imageParentView}>
                <Image
                  style={style.imageStyle}
                  source={{ uri: 'ic_action_add_vertex' }}
                />
              </View>
              <Text style={style.imageText}>加点</Text>
            </TouchableOpacity>
          </View>

          <View style={style.touchViewParent}>
            <TouchableOpacity
              style={style.touchView}
              onPress={() => {
                this.deleteSketchSelectedVertex();
              }}
            >
              <View style={style.imageParentView}>
                <Image
                  style={style.imageStyle}
                  source={{ uri: 'ic_action_delete_vertex' }}
                />
              </View>
              <Text style={style.imageText}>删点</Text>
            </TouchableOpacity>
          </View>

          <View style={style.touchViewParent}>
            <TouchableOpacity
              style={style.touchView}
              onPress={() => {
                this.stopSketchEdit();
              }}
            >
              <View style={style.imageParentView}>
                <Image
                  style={style.imageStyle}
                  source={{ uri: 'ic_action_stop' }}
                />
              </View>
              <Text style={style.imageText}>停止</Text>
            </TouchableOpacity>
          </View>

          <View style={style.touchViewParent}>
            <TouchableOpacity
              style={style.touchView}
              onPress={() => {
                this.undoSketchEdit();
              }}
            >
              <View style={style.imageParentView}>
                <Image
                  style={style.imageStyle}
                  source={{ uri: 'ic_action_undo' }}
                />
              </View>
              <Text style={style.imageText}>撤销</Text>
            </TouchableOpacity>
          </View>

          <View style={style.touchViewParent}>
            <TouchableOpacity
              style={style.touchView}
              onPress={() => {
                this.redoSketchEdit();
              }}
            >
              <View style={style.imageParentView}>
                <Image
                  style={style.imageStyle}
                  source={{ uri: 'ic_action_redo' }}
                />
              </View>
              <Text style={style.imageText}>重做</Text>
            </TouchableOpacity>
          </View>

          <View style={style.touchViewParent}>
            <TouchableOpacity
              style={style.touchView}
              onPress={() => {
                this.clearGeometrySketchEdit();
              }}
            >
              <View style={style.imageParentView}>
                <Image
                  style={style.imageStyle}
                  source={{ uri: 'ic_action_clear' }}
                />
              </View>
              <Text style={style.imageText}>清除</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[style.bottomView, style.bottomViewWidth]}>
          <Picker
            style={style.pickerStyle}
            mode="dropdown"
            selectedValue={this.state.selectedValue}
            onValueChange={(itemValue, itemIndex) => {
              this.changePickerValue(itemValue, itemIndex);
            }}
          >
            {this.state.pickerData.map(item => (
              <Picker.Item
                key={item}
                value={item}
                label={item}
                itemStyle={style.pickerItem}
              />
            ))}
          </Picker>
          <View style={[style.bottomView, { marginLeft: -50 }]}>
            <View style={style.touchViewParent}>
              <TouchableOpacity
                style={style.touchView}
                onPress={() => {
                  this.saveFeature();
                }}
              >
                <View style={style.imageParentView}>
                  <Image style={style.imageStyle} source={{ uri: 'save' }} />
                </View>
                <Text style={style.imageText}>保存</Text>
              </TouchableOpacity>
            </View>

            <View style={style.touchViewParent}>
              <TouchableOpacity
                style={style.touchView}
                onPress={() => {
                  this.deleteFeature();
                }}
              >
                <View style={style.imageParentView}>
                  <Image style={style.imageStyle} source={{ uri: 'delete' }} />
                </View>
                <Text style={style.imageText}>删除</Text>
              </TouchableOpacity>
            </View>

            <View style={style.touchViewParent}>
              <TouchableOpacity
                style={style.touchView}
                onPress={() => {
                  this.modifyAttr();
                }}
              >
                <View style={style.imageParentView}>
                  <Image style={style.imageStyle} source={{ uri: 'modify' }} />
                </View>
                <Text style={style.imageText}>属性</Text>
              </TouchableOpacity>
            </View>

            <View style={style.touchViewParent}>
              <TouchableOpacity
                style={style.touchView}
                onPress={() => {
                  this.modifyInfo();
                }}
              >
                <View style={style.imageParentView}>
                  <Image style={style.imageStyle} source={{ uri: 'modify' }} />
                </View>
                <Text style={style.imageText}>样式</Text>
              </TouchableOpacity>
            </View>

            <View style={style.touchViewParent}>
              <TouchableOpacity
                style={style.touchView}
                onPress={() => {
                  this.modifyGeometry();
                }}
              >
                <View style={style.imageParentView}>
                  <Image style={style.imageStyle} source={{ uri: 'modify' }} />
                </View>
                <Text style={style.imageText}>几何</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  touchViewParent: {
    marginLeft: 6,
    marginRight: 6,
    marginTop: 5,
    marginBottom: 5,
  },
  touchView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageParentView: {
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#rgba(245,83,61,0.8)',
  },
  imageStyle: {
    width: 25,
    height: 25,
  },
  imageText: {
    fontSize: 13,
    color: '#fff',
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#000',
    paddingTop: 5,
  },

  bottomViewWidth: {
    width: Dimensions.get('window').width,
  },

  pickerStyle: {
    width: 125,
    height: 45,
    color: '#fff',
  },
  pickerItem: {
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(245,83,61,0.8)',
    color: '#000',
    borderRadius: 15,
    alignItems: 'center',
  },
  modalView: {
    marginTop: 150,
    padding: 5,
    backgroundColor: '#fff',
  },
  itemTitle: {
    justifyContent: 'center',
    flexDirection: 'column',
    fontSize: 17,
    color: '#62b3ff',
    padding: 10,
    marginLeft: 5,
  },
  separator: {
    width: Dimensions.get('window').width,
    height: 1,
    backgroundColor: '#62b3ff',
  },
  referenceView: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  modalButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
