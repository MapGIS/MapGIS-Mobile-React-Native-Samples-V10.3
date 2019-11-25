import React, { Component } from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import styles from '../styles';
import { MGMapView } from '@mapgis/mobile-react-native';
import { MAPX_FILE_PATH } from '../utils';

/**
 * @content 图层控制
 * @author xiaoying 2019-08-20 09:37
 */

export default class MapLayerControl extends Component {
  static navigationOptions = { title: '图层控制' };

  constructor() {
    super();
    this.state = {
      modalVisible: false,
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
  // 获取地图图层数据并显示
  setModalVisible = async visible => {
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
    this.setState({ modalVisible: visible, layerArray: layers });
  };
  // 生成图层列表项
  _renderItem = item => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={style.itemView}
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
            this._changeMapLayerVisible(item.id, true);

            this.setState({
              layerArray: layerArray,
              selected: '可见' + item.id,
            });
          }
        }}
      >
        <Text style={style.itemKey}>{item.name}</Text>
        <Text style={style.itemValue}>{item.visible}</Text>
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
            this.setModalVisible(false);
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
                this.setModalVisible(true);
              }}
            >
              <Text style={styles.text}>图层控制</Text>
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
