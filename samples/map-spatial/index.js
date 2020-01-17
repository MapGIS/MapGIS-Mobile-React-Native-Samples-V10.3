import { mapComponents } from '../utils';
import MapBufferAnalysis from './buffer-analysis';
import MapClipAnalysis from './clip-analysis';
import MapCalculateLength from './length-calculator';
import MapCalculateArea from './area-calculator';
import MapSpatialCalculator from './spatial-calculator.js';
import MapOverlayAnalysis from './overlay-analysis.js';
import MapSpatialRelation from './spatial-relation.js';

export default mapComponents('MapSpatial', {
  MapBufferAnalysis,
  MapClipAnalysis,
  MapOverlayAnalysis,
  MapSpatialRelation,
  MapSpatialCalculator,
  MapCalculateLength,
  MapCalculateArea,
});
