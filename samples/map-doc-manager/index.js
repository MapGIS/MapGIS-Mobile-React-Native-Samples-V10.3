import { mapComponents } from '../utils';
import MapBaseInformation from './map-base-information';
import MapLayerProperty from './map-layer-property';
import MapLayerControl from './map-layer-control';
import MapLayerOverlay from './map-layer-overlay';

export default mapComponents('MapDocManager', {
  MapBaseInformation,
  MapLayerProperty,
  MapLayerControl,
  MapLayerOverlay,
});
