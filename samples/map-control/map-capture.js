import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  DeviceEventEmitter,
  ToastAndroid,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import styles from '../styles';
import { MGMapView, Rect } from '@mapgis/mobile-react-native';
import { MAPX_FILE_PATH, INITIALIZE_PATH } from '../utils';

/**
 * @content 地图截屏功能示例
 * @author xiaoying 2019-11-25
 */

export default class MapCapture extends Component {
  static navigationOptions = { title: '地图截屏功能' };

  constructor() {
    super();
    this.state = {
      title: '截屏',
      modalVisible: false,
      imageUri: 'ic_action_freehand_line',
    };
  }

  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  componentDidMount() {
    this.mapLoadListener = DeviceEventEmitter.addListener(
      'com.mapgis.RN.Mapview.LoadMapListener_Finish',
      async res => {
        if (res.DidFinishLoadingMap) {
          ToastAndroid.show('地图加载完成', ToastAndroid.SHORT);
          let rect = new Rect();
          let rectObj = await rect.createObj(
            12705276.572663,
            3542912.332349,
            12746062.17078,
            3607262.942711
          );

          await this.mapView.zoomToRange(rectObj, false);
        } else {
          ToastAndroid.show('地图加载失败', ToastAndroid.SHORT);
        }
      }
    );
  }

  componentWillUnmount() {
    this.mapLoadListener.remove();
  }

  openMap = async () => {
    await this.mapView.registerMapLoadListener();
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
  };

  // 截屏
  screenShot = async () => {
    let bitmapPath = await this.mapView.getScreenSnapshot(
      INITIALIZE_PATH + '/Resource/'
    );

    this.showBitmap(bitmapPath, '截屏');
  };

  showBitmap = (bitmapPath, title) => {
    if (bitmapPath !== '') {
      this.setState({ imageUri: bitmapPath, modalVisible: true, title: title });
    } else {
      ToastAndroid.show('没有生成可用的图片！');
    }
  };

  // 范围截屏
  screenShotRange = async () => {
    let width = (await this.mapView.getMeasuredWidth()) / 2;
    let height = (await this.mapView.getMeasuredHeight()) / 2;

    let result = await this.mapView.getScreenSnapshotByParam(
      INITIALIZE_PATH + '/Resource/',
      0,
      0,
      width,
      height
    );

    this.showBitmap(result.bitmapPath, '范围截屏');
  };

  // 范围出图
  showBitmapRange = async () => {
    let map = await this.mapView.getMap();
    let entireRange = await map.getEntireRange();
    let measuredWidth = await this.mapView.getMeasuredWidth();
    let measuredHeight = await this.mapView.getMeasuredHeight();

    let obj = { width: measuredWidth, height: measuredHeight, type: 'png' };
    let bitmapPath = await this.mapView.getBitmap(
      entireRange,
      INITIALIZE_PATH + '/Resource/',
      obj
    );

    this.showBitmap(bitmapPath, '范围出图');
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
            this.setState({ modalVisible: false });
          }}
        >
          <View style={style.imageParentView}>
            <Text style={style.imageTitle}>{this.state.title}</Text>
            <Image
              style={style.image}
              source={{
                uri: this.state.imageUri,
              }}
            />
          </View>
        </Modal>

        <View style={styles.buttons}>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.screenShot();
              }}
            >
              <Text style={styles.text}>截屏</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.screenShotRange();
              }}
            >
              <Text style={styles.text}>范围截屏</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.showBitmapRange();
              }}
            >
              <Text style={styles.text}>范围出图</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  imageParentView: {
    width: Dimensions.get('window').width - 50,
    height: Dimensions.get('window').height - 80,
    backgroundColor: '#fff',
    borderColor: '#62b3ff',
    borderWidth: 2,
    marginTop: 50,
    marginLeft: 25,
    marginBottom: 30,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  imageTitle: {
    flex: 0,
    height: 50,
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#000',
    textAlignVertical: 'center',
  },
  image: {
    flex: 1,
  },
});
