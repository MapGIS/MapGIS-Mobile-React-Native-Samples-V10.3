import { mapComponents } from '../utils';
import OfflineVectorMap from './offline-vector-map';
import OfflineTileMap from './offline-tile-map';
import onlineVectorMap from './online-vector-map';
import onlineTileMap from './online-tile-map';

export default mapComponents('MapDisplay', {
  OfflineVectorMap,
  OfflineTileMap,
  onlineVectorMap,
  onlineTileMap,
});
