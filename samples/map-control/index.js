import { mapComponents } from '../utils';
import MapBasicOperate from './basic-operate';
import MapUIControl from './ui-control';
import MapCapture from './map-capture';
import MapSetBackground from './map-set-background';
import MapGesturesControl from './gestures-control';
import MapGesturesListen from './gestures-listen';
import MapShowListen from './show-listen';
import MapSetSystemLibrary from './map-set-system-library';
import MapSplitScreen from './map-split-screen';

export default mapComponents('MapControl', {
  MapBasicOperate,
  MapUIControl,
  MapCapture,
  MapSplitScreen,
  MapSetBackground,
  MapGesturesControl,
  MapGesturesListen,
  MapShowListen,
  MapSetSystemLibrary,
});
