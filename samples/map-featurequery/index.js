import { mapComponents } from "../utils";
import MapRectQuery from "./rect-query";
import MapPopertyQuery from "./poperty-query";
import MapCompoundQuery from "./compound-query";


export default mapComponents("MapFeatureQuery", {
  MapRectQuery,
  MapPopertyQuery,
  MapCompoundQuery,
});
