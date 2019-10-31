import { mapComponents } from '../utils';
import MapBasicOperate from './basic-operate';
import MapUIControl from './ui-control';
import MapGesturesControl from './gestures-control';
import MapGesturesListen from './gestures-listen';
import MapShowListen from './show-listen';

export default mapComponents('MapControl', {
  MapBasicOperate,
  MapUIControl,
  MapGesturesControl,
  MapGesturesListen,
  MapShowListen,
});
