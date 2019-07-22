import { mapComponents } from "../utils";
import MapBasicOperate from "./basic-operate";
import MapUIControl from "./ui-control";
import MapGesturesControl from "./gestures-control";

export default mapComponents("MapControl", {
  MapBasicOperate,
  MapUIControl,
  MapGesturesControl
});
