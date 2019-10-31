import { mapComponents } from '../utils';
import MapPointQuery from './point-query';
import MapRectQuery from './rect-query';
import MapPolygonQuery from './polygon-query';
import MapPopertyQuery from './poperty-query';
import MapCompoundQuery from './compound-query';
import MapIGServerQuery from './igserver-query';

export default mapComponents('MapFeatureQuery', {
  MapPointQuery,
  MapRectQuery,
  MapPolygonQuery,
  MapPopertyQuery,
  MapCompoundQuery,
  MapIGServerQuery,
});
