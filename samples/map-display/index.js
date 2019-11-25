import { mapComponents } from '../utils';
import OfflineVectorMap from './offline-vector-map';
import OfflineTileMap from './offline-tile-map';
import onlineVectorMap from './online-vector-map';
import onlineTileMap from './online-tile-map';
import onlineWMSMap from './online-wms-map';
import onlineWMtsMap from './online-wmts-map';
import DisplayOSMMap from './display-osm-map';
import DisplayTianDiTuMap from './display-tianditu-map';
import DisplayGoogleMap from './display-google-map';
import DisplayBaiDuMap from './display-baidu-map';
import DisplayAMapMap from './display-AMap-map';
import DisplayBingMap from './display-Bing-Map';
import Display3DViewMap from './display-3dview-map';
import DisplayAddIGServerLayer from './display-add-igserver-layer';
import DisplayAddOnlineLayer from './display-add-online-layer';

export default mapComponents('MapDisplay', {
  OfflineVectorMap,
  OfflineTileMap,
  onlineVectorMap,
  onlineTileMap,
  onlineWMSMap,
  onlineWMtsMap,
  DisplayOSMMap,
  DisplayTianDiTuMap,
  DisplayGoogleMap,
  DisplayBaiDuMap,
  DisplayAMapMap,
  DisplayBingMap,
  Display3DViewMap,
  DisplayAddIGServerLayer,
  DisplayAddOnlineLayer,
});
