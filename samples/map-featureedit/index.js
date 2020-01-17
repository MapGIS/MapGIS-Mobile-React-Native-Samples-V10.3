import { mapComponents } from '../utils';
import MapOfflineEdit from './offline-edit';
import MapIGServerEdit from './igserver-edit';
import DocLayerEditSketchDemo from './docLayer-edit-sketch';

export default mapComponents('MapFeatureEdit', {
  MapOfflineEdit,
  MapIGServerEdit,
  DocLayerEditSketchDemo,
});
