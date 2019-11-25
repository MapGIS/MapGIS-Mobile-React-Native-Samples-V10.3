import React, { Component } from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from 'react-native';
import styles from '../styles';
import { MGMapView, XClsType } from '@mapgis/mobile-react-native';
import { MAPX_FILE_PATH } from '../utils';

/**
 * @content 图层属性
 * @author xiaoying 2019-08-20 09:37
 */

export default class MapLayerControl extends Component {
  static navigationOptions = { title: '图层属性' };

  constructor() {
    super();
    this.state = {
      modalVisible: false,
      layerDetailModalVisible: false,
      removeLayerModalVisible: false,
      layerArray: null,
      selected: '可见',
    };
  }
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
    this.map = await this.mapView.getMap();
  };

  // 更改地图图层可见性
  _changeMapLayerVisible = async (id, visible) => {
    let mapLayer = await this.map.getLayer(id);
    await mapLayer.setVisible(visible);
    await this.mapView.forceRefresh();
  };

  // 获取所有图层并显示
  showAllLayer = async visible => {
    let layers = [];
    if (this.map !== null) {
      let layerCount = await this.map.getLayerCount();
      for (let i = 0; i < layerCount; i++) {
        let mapLayer = await this.map.getLayer(i);
        let name = await mapLayer.getName();
        let layerVisible = await mapLayer.getIsVisible();
        let layer = {
          id: i,
          name: name,
          visible: layerVisible === true ? '可见' : '不可见',
        };
        layers.push(layer);
      }
    }

    this.setState({ layerArray: layers });
    this.setAllLayerModalVisible(visible);
  };

  // 展示所有图层的模态视图可见性
  setAllLayerModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  // 展示图层详情的模态视图可见性
  setLayerDetailModalVisible = visible => {
    this.setState({ layerDetailModalVisible: visible });
  };

  //  删除模态视图的可见性
  setRemoveLayerModalVisible = visible => {
    this.setState({ removeLayerModalVisible: visible });
  };

  // 查看图层详情
  checkLayerDetail = async item => {
    // 1、隐藏所有图层视图
    this.setAllLayerModalVisible(false);
    // 2、获取当前图层属性
    let mapLayer = await this.map.getLayer(item.id);
    if (mapLayer === null) {
      return;
    }
    let layerName = await mapLayer.getName();
    let url = await mapLayer.getURL(); // url
    let isVisible = await mapLayer.getIsVisible(); // 可见性
    let state = await mapLayer.getState(); //  图层状态
    let minScale = await mapLayer.getMinScale(); // 最小显示比
    let maxScale = await mapLayer.getMaxScale(); // 最大显示比
    let xClsType = await mapLayer.getClsType(); // 图层类型
    let layerType = 'Unknown';

    switch (xClsType) {
      case XClsType.Unknown:
        layerType = 'Unknown';
        break;

      case XClsType.Fds:
        layerType = 'Fds';
        break;

      case XClsType.ACls:
        layerType = 'ACls';
        break;

      case XClsType.SFCls:
        layerType = 'SFCls';
        break;

      default:
        break;
    }

    let property =
      'url：' +
      url +
      '\n' +
      'isVisible：' +
      isVisible +
      '\n' +
      'state：' +
      state +
      '\n' +
      '最小显示比：' +
      minScale +
      '\n' +
      '最大显示比：' +
      maxScale +
      '\n' +
      '类型：' +
      layerType +
      '\n';

    // 3、显示属性信息
    Alert.alert(layerName, property, [
      {
        text: '确定',
        onPress: () => {
          this.setAllLayerModalVisible(true);
        },
      },
    ]);
  };

  // 显示移除图层
  removeLayer = item => {
    // 1、隐藏所有图层视图
    this.setAllLayerModalVisible(false);
    // 2、提示是否删除图层
    Alert.alert('移除图层', '确认删除此图层吗？', [
      {
        text: '确认',
        onPress: () => {
          this.confirmRemoveLayer(item);
        },
      },
      {
        text: '取消',
        onPress: () => {
          this.setAllLayerModalVisible();
        },
      },
    ]);
  };

  // 点击确认按钮，移除图层
  confirmRemoveLayer = async item => {
    let removeResult = await this.map.removeByIndex(item.id);
    ToastAndroid.show('移除图层:' + removeResult, ToastAndroid.SHORT);
    await this.mapView.forceRefresh();
    // 显示所有图层视图
    this.showAllLayer(true);
  };

  // 生成图层列表项
  _renderItem = item => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={style.itemView}
        // 单击设置图层可见性
        onPress={() => {
          let layerArray = this.state.layerArray;
          if (layerArray[item.id].visible === '可见') {
            // 更改可见为不可见，selected可用于刷新列表
            layerArray[item.id].visible = '不可见';

            this.setState({
              layerArray: layerArray,
              selected: '不可见' + item.id,
            });

            // 更改图层可见性
            this._changeMapLayerVisible(item.id, false);
          } else {
            layerArray[item.id].visible = '可见';

            this.setState({
              layerArray: layerArray,
              selected: '可见' + item.id,
            });

            this._changeMapLayerVisible(item.id, true);
          }
        }}
        // 长按删除图层
        onLongPress={() => {
          this.removeLayer(item);
        }}
      >
        <Text style={style.itemKey}>{item.name}</Text>
        <Text
          style={style.itemValue}
          onPress={() => {
            this.checkLayerDetail(item);
          }}
        >
          详情
        </Text>
      </TouchableOpacity>
    );
  };

  // 列表项分割线
  _separator = () => {
    return <View style={style.separator} />;
  };

  render() {
    return (
      <View style={styles.container}>
        <MGMapView
          ref="mapView"
          onGetInstance={this.onGetInstance}
          style={styles.mapView}
        />

        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setAllLayerModalVisible(false);
          }}
        >
          <FlatList
            style={style.flatListBackground}
            data={this.state.layerArray}
            extraData={this.state.selected} // 可用于指定其他数据或者当点击项时候刷新列表
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => this._renderItem(item)}
            ItemSeparatorComponent={this._separator}
          />
        </Modal>
        <View style={styles.buttons}>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.showAllLayer(true);
              }}
            >
              <Text style={styles.text}>图层查看</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  button: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  itemTitle: {
    justifyContent: 'center',
    flexDirection: 'row',
    fontSize: 14,
  },
  flatListBackground: {
    backgroundColor: '#ffffff',
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 60,
    marginBottom: 45,
  },

  // 图层列表背景色
  itemView: {
    backgroundColor: '#ffffff',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    margin: 5,
  },
  // item的图层名称样式
  itemKey: {
    padding: 10,
    fontSize: 16,
    color: '#333333',
    flexDirection: 'row',
    flex: 3,
  },
  // item的可见字体样式
  itemValue: {
    fontSize: 16,
    color: '#666666',
    flexDirection: 'row',
    padding: 10,
    textAlign: 'center',
    flex: 1,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#F5F5F5',
  },
});
