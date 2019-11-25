import React, { Component } from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import styles from '../styles';
import { MGMapView, ServerLayer, MapServer } from '@mapgis/mobile-react-native';
import { MAPX_FILE_PATH, TILE_FILE_PATH } from '../utils';

/**
 * @content 图层叠加
 * @author xiaoying 2019-08-20 09:37
 */

export default class MapLayerOverlay extends Component {
  static navigationOptions = { title: '图层叠加' };

  constructor() {
    super();
    this.state = {
      modalVisible: false,
      serverLayerTypeName: 'Google服务图层',
      selectIndex: 0,
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

  // 设置叠加服务图层的显示界面的可见性
  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  // 单选框设置服务类型
  onSelect = (index, value) => {
    this.setState({ selectIndex: index, serverLayerTypeName: value });
  };

  // 移除图层
  removeLayer = async layerName => {
    let index = await this.map.indexOfByName(layerName);

    if (index !== -1) {
      // 移除图层结果
      await this.map.removeByIndex(index);
    }
  };

  // 确认添加服务图层
  insertLayer = async () => {
    if (this.state.serverLayerTypeName === 'Google服务图层') {
      // 2、插入服务图层是google服务图层，先移除离线图层，再添加图层
      this.removeLayer('离线瓦片地图');

      let serverLayerObj = new ServerLayer();
      let serverLayer = await serverLayerObj.createObj();
      let googleMapServer = await ServerLayer.createMapServer(
        MapServer.MapServerType.MAPSERVER_TYPE_GOOGLE_SATELLITEMAP
      );
      // 设置服务图层的数据源
      await serverLayer.setMapServer(googleMapServer);
      // 设置图层名称
      await serverLayer.setName('Google服务图层');
      await this.map.insert(2, serverLayer);
      await this.mapView.forceRefresh();
    } else {
      // 2、插入的是离线瓦片地图，先移除Google服务图层，再添加离线瓦片地图
      this.removeLayer('Google服务图层');

      let offServerLayerObj = new ServerLayer();
      let offServerLayer = await offServerLayerObj.createObj();
      let offlineTileMapServer = await ServerLayer.createMapServer(
        MapServer.MapServerType.MAPSERVER_TYPE_TDF
      );
      await offlineTileMapServer.setURL(TILE_FILE_PATH);
      await offlineTileMapServer.setName('离线瓦片地图');
      await offServerLayer.setMapServer(offlineTileMapServer);
      await offServerLayer.setName('离线瓦片地图');
      let insertResult = await this.map.insert(2, offServerLayer);
      await this.mapView.forceRefresh();
      let index = await this.map.indexOfByName('离线瓦片地图');
      ToastAndroid.show(
        '添加离线瓦片地图：' + insertResult + ',index: ' + index,
        ToastAndroid.SHORT
      );
    }

    this.setModalVisible(false);
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
          <View style={style.modalView}>
            <View style={style.itemView}>
              <Text style={style.itemTitle}>请选择叠加的服务图层类型</Text>
              <View style={style.separator} />
            </View>
            <RadioGroup
              style={style.radioGroup}
              color="#FFF"
              activeColor="#f5533d"
              selectedIndex={this.state.selectIndex}
              onSelect={(index, value) => this.onSelect(index, value)}
            >
              <RadioButton style={style.radioButton} value={'Google服务图层'}>
                <Text style={styles.text}>Google服务图层</Text>
              </RadioButton>
              <RadioButton style={style.radioButton} value={'离线瓦片地图'}>
                <Text style={styles.text}>离线瓦片地图</Text>
              </RadioButton>
            </RadioGroup>

            <TouchableOpacity style={style.confirmExistButton}>
              <Text
                style={style.confirmText}
                onPress={() => {
                  this.insertLayer();
                }}
              >
                确定
              </Text>
              <Text
                style={style.exitText}
                onPress={() => {
                  this.setModalVisible(false);
                }}
              >
                取消
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <View style={styles.buttons}>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(true);
              }}
            >
              <Text style={styles.text}>图层叠加</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  modalView: {
    marginTop: 150,
    padding: 5,
  },
  itemView: {
    backgroundColor: '#292c36',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  itemTitle: {
    justifyContent: 'center',
    flexDirection: 'column',
    fontSize: 17,
    color: '#ffffff',
    padding: 10,
  },
  separator: {
    width: Dimensions.get('window').width,
    height: 1,
    backgroundColor: '#ffffff',
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
  confirmExistButton: {
    backgroundColor: '#292c36',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  confirmText: {
    fontSize: 16,
    color: '#f5533d',
    marginRight: 20,
    padding: 15,
  },
  exitText: {
    fontSize: 16,
    color: '#fff',
    padding: 15,
  },
});
