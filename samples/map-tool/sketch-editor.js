import React, { Component } from 'react';
import styles from '../styles';
import {
  MGMapView,
  Rect,
  SketchDataType,
  SketchEditor,
} from '@mapgis/mobile-react-native';
import { MAPX_FILE_PATH } from '../utils';

import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  DeviceEventEmitter,
  ToastAndroid,
} from 'react-native';
/**
 * @content 草图编辑器示例
 * @author xiaoying 2019-11-28
 */

export default class SketchEditorDemo extends Component {
  static navigationOptions = { title: '草图编辑器' };

  constructor() {
    super();
    this.state = {
      sketchEditor: null,
    };
  }
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.registerMapLoadListener();
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
    this.map = await this.mapView.getMap();
  };

  componentDidMount() {
    // geometry_changed
    this.geometryChangedListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.SketchEditor.geometry_changed',
      async res => {
        ToastAndroid.show(
          'SketchEditorId' + res.SketchEditorId,
          ToastAndroid.SHORT
        );
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
          this.initSketchEditor();
        } else {
          ToastAndroid.show('地图加载失败', ToastAndroid.SHORT);
        }
      }
    );
  }

  componentWillUnmount = () => {
    this.geometryChangedListener.remove();
    this.vertexSelectedListener.remove();
    this.undoStateChangedListener.remove();
    this.redoStateChangeListener.remove();
    this.mapLoadListener.remove();
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
                this.startSketchEdit(SketchDataType.FREEHAND_LINE);
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
                this.startSketchEdit(SketchDataType.FREEHAND_POLYGON);
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
                this.startSketchEdit(SketchDataType.POINT);
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
                this.startSketchEdit(SketchDataType.MULTIPOINT);
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
                this.startSketchEdit(SketchDataType.POLYLINE);
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
                this.startSketchEdit(SketchDataType.POLYGON);
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
      </View>
    );
  }
}

const style = StyleSheet.create({
  touchViewParent: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  touchView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageParentView: {
    width: 60,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#rgba(245,83,61,0.8)',
  },
  imageStyle: {
    width: 30,
    height: 30,
  },
  imageText: {
    fontSize: 14,
    color: '#fff',
  },
});
