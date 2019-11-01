import {
  Platform,
  PermissionsAndroid,
  Alert,
  NativeModules,
} from 'react-native';

/**
 * 环境初始化路径
 */
export const INITIALIZE_PATH = 'MapGISSample';

/**
 * 存放系统库的路径
 */
export const SYSTEM_LIB_PATH1 = INITIALIZE_PATH + '/';
export const SYSTEM_LIB_PATH2 = INITIALIZE_PATH + '/AnotherSystemlib/';

/**
 * 存放地图数据路径
 * 说明：
 *      离线矢量数据通过Mapgis 10桌面工具制作并转换移动端离线数据
 *      离线瓦片可以通过MapGIS 10裁剪的瓦片可直接放到SDCARD上读取
 *      在线瓦片和在线矢量数据可以由IGServer发布的地图服务服务，移动端可以代码的方式添加在线服务也可以配置地图文件直接loadFromFileAsync
 *      同时移动端支持对接高德、GOOGLE、百度、天地图等在线服务
 */

/**
 * 离线矢量地图路径
 */
export const MAPX_FILE_PATH = INITIALIZE_PATH + '/Map/MapShow/WuHan/WuHan.mapx';
export const DB_FILE_PATH = INITIALIZE_PATH + '/Map/MapShow/WuHan/武汉MKT.mgdb';
export const DB_CREATE_FILE_PATH = INITIALIZE_PATH + "/Map/MapShow/RNCreateDb0927/RNTest0927.mgdb";

export const DB_UPDATE_FILE_PATH = INITIALIZE_PATH + "/Map/IncrementalUpdate/change.mudb";

/**
 * 离线瓦片：
 * （1）瓦片文件
 * （2）瓦片地图文档
 */
export const TILE_FILE_PATH = INITIALIZE_PATH + '/Map/MapShow/WorldMKTTile.TDF';
export const TILE_MAPX_PATH =
  INITIALIZE_PATH + '/Map/MapShow/WorldMKTTile.mapx';

/**
 * 在线矢量地图：
 * （1）服务地址
 * （2）地图文档
 */
export const SERVER_DOC_URL_PATH =
  'http://develop.smaryun.com:6163/igs/rest/mrms/docs/WorldJWVector';
export const SERVER_DOC_MAPX_PATH =
  INITIALIZE_PATH + '/Map/MapShow/OnlineWorldJWVector.mapx';

/**
 * 在线瓦片地图服务地址
 * （1）服务地址
 * （2）地图文档
 */
export const SERVER_TILE_URL_PATH =
  'http://develop.smaryun.com:6163/igs/rest/mrms/tile/JWWORLDTILE';
export const SERVER_TILE_MAPX_PATH =
  INITIALIZE_PATH + '/Map/MapShow/OnlineWorldJWTile.mapx';

/**
 * OGC在线服务地址
 * （1）WMS服务
 * （2）WMTS服务
 */
export const OGC_WMS_DOC_PATH =
  'http://develop.smaryun.com:6163/igs/rest/ogc/doc/SampleDoc/WMSServer';
export const OGC_WMS_LAYER_PATH =
  'http://develop.smaryun.com:6163/igs/rest/ogc/layer/testLayerWMS/WMSServer';
export const OGC_WMTS_PATH =
  'http://develop.smaryun.com:6163/igs/rest/ogc/WMTSServer/WORLDMKTTILE2';

/**
 * 第三方在线地图服务地址
 * （1）天地图矢量数据
 * （2）天地图矢量注记基地址
 */
export const TIANDITU_VECTOR_PATH = 'http://t0.tianditu.gov.cn/vec_c/wmts';
export const TIANDITU_ANNO_PATH = 'http://t0.tianditu.gov.cn/cva_c/wmts';
export const TIANDITU_TERRAIN_PATH = 'http://t0.tianditu.gov.cn/ter_w/wmts';

/**
 * 高德在线地图文档
 */
export const AMAP_TILE_PATH = INITIALIZE_PATH + '/Map/MapShow/AMapTileMap.mapx';

/**
 * 离线三维地图数据（灰度模型）
 */
export const BUIDING_FILE_PATH =
  INITIALIZE_PATH + '/Map/MapShow/Buildings/buildings.mapx';

/**
 * 在线数据-武汉区域地图-图层目录树示例
 */
export const IGS_WUHAN_AREA_URL =
  'http://develop.smaryun.com:6163/igs/rest/mrms/docs/wuhanArea';

/**
 * 离线矢量地图文档：查询统计图、专题图
 */
export const WUHANAREA_FILE_PATH =
  INITIALIZE_PATH + '/Map/ThemeMap/wuhanArea.mapx';

/**
 * 在线数据
 * （1）服务基地址
 * （2）IGServer在线地图属性查询
 * （2）要素编辑数据
 */
export const IGSERVER_BASE_URL = 'http://develop.smaryun.com:6163/igs';
export const IGSERVER_DOC_WUHAN_PATH =
  IGSERVER_BASE_URL + '/rest/mrms/docs/WuHan';
export const IGSERVER_DOC_WUHANEDIT_PATH =
  IGSERVER_BASE_URL + '/rest/mrms/docs/WuHanEdit';

/**
 * 地图编辑离线数据
 * （1）要素编辑 | 数据同步编辑 | 数据增量更新
 * （2）要素编辑(矢量类方式) | 增量更新基础库
 * （3）增量更新更新库(数据变化)
 * （4）增量更新更新库(数据恢复)
 */
export const MAP_EDIT_MAPX_PATH =
  INITIALIZE_PATH + '/Map/MapEdit/WuHanEdit.mapx';
export const MAP_EDIT_DB_PATH = INITIALIZE_PATH + '/Map/MapEdit/武汉MKT.mgdb';
export const DATA_INCREMENTAL_UPDATE_PATH_1 =
  INITIALIZE_PATH + '/Map/IncrementalUpdate/change.mudb';
export const DATA_INCREMENTAL_UPDATE_PATH_2 =
  INITIALIZE_PATH + '/Map/IncrementalUpdate/recover.mudb';

/**
 * 模拟轨迹记录
 * （1）轨迹记录的数据存放的数据库
 * （2）轨迹记录道路匹配的数据库
 * （3）轨迹数据：gpx格式文件
 */
export const TRACK_SIMULATE_MGDB_FILE_PATH =
  INITIALIZE_PATH + '/Track/TrackSample.mgdb';
export const TRACK_MATCH_MGDB_FILE_PATH =
  INITIALIZE_PATH + '/Track/TrackMatch.mgdb';
export const TRACK_SIMULATE_GPX_FILE_PATH =
  INITIALIZE_PATH + '/Track/TrackData.gpx';

/**
 * 导航数据
 * （1）室外导航数据
 * （2）室内导航数据以及建筑物轮廓文件
 * （3）室内导航地图
 */
export const NAVI_OUTDOORDB_FILE_PATH =
  INITIALIZE_PATH + '/Navigation/outdoor/WuhanNavi.db';
export const NAVI_INDOOR_FILES_PATH = INITIALIZE_PATH + '/Navigation/indoor';
export const NAVI_INDOOR_MAPX_PATH =
  INITIALIZE_PATH + '/Navigation/ZondyBuilding/ZondyBuilding.mapx';

/**
 * 离线POI数据
 */
export const POI_FILE_PATH = INITIALIZE_PATH + '/POI/wuhanpoi.db';

/**
 * 服务调用（武汉道路网）
 */
export const MAPX_WHDLW =
  INITIALIZE_PATH + '/Map/MapShow/WuHanRoadNetwork/whdlw.mapx';

//纹理线图标
export const IMG_FILE_PATH = INITIALIZE_PATH + "/Map/Image/ico_texture_line.png";

//标注显示图标
export const ANN_FILE_PATH = INITIALIZE_PATH + "/Map/Image/location.png"; 

export function mapComponents(prefix, screens) {
  return Object.keys(screens).reduce((result, name) => {
    const screen = screens[name];
    const { title } = screen.navigationOptions;
    result[`${prefix}${name}`] = { screen, title };
    return result;
  }, {});
}

function checkGranted(granteds) {
  const values = Object.values(granteds);
  let isGranted = true;
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] != values[i + 1]) {
      isGranted = false;
      break;
    }
  }
  if (isGranted && values[0] === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }
  return false;
}

export async function requestMultiplePermission() {
  if (Platform.OS === 'ios') {
    return;
  }

  try {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    ];
    //返回得是对象类型
    const granteds = await PermissionsAndroid.requestMultiple(permissions);
    if (!checkGranted(granteds)) {
      throw new Error('授权拒绝，无法正常使用本应用');
    }
  } catch (err) {
    throw new Error('授权失败，无法正常使用本应用');
  }
}

export default { mapComponents, requestMultiplePermission };
