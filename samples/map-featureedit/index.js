import { mapComponents } from '../utils';
import MapOfflineEdit from './offline-edit';
import MapIGServerEdit from './igserver-edit';
//import MapSketchEdit from './sketch-edit';

export default mapComponents('MapFeatureEdit', {
  MapOfflineEdit,
  // MapSketchEdit,
  MapIGServerEdit,
});
