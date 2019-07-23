import { mapComponents } from "../utils";
import MapGraphicPoint from "./graphic-point";
import MapGraphicPolyline from "./graphic-polyline";
import MapGraphicPolygon from "./graphic-polygon";
import MapGraphicCircle from "./graphic-circle";
import MapGraphicText from "./graphic-text";
import MapGraphicImage from "./graphic-image";


export default mapComponents("MapGraphic", {
  MapGraphicPoint,
  MapGraphicPolyline,
  MapGraphicPolygon,
  MapGraphicCircle,
  MapGraphicText,
  MapGraphicImage,
});
