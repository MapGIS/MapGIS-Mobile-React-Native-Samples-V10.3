import { mapComponents } from '../utils';
import MapGraphicPoint from './graphic-point';
import MapGraphicPolyline from './graphic-polyline';
import MapGraphicCircle from './graphic-circle';
import MapGraphicPolygon from './graphic-polygon';
import MapGraphicText from './graphic-text';
import MapGraphicImage from './graphic-image';
import MapGraphicInterActive from './graphic-interactive';

export default mapComponents('MapGraphic', {
  MapGraphicPoint,
  MapGraphicPolyline,
  MapGraphicCircle,
  MapGraphicPolygon,
  MapGraphicText,
  MapGraphicImage,
  MapGraphicInterActive,
});
