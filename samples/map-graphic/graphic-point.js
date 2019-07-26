import React, { Component } from "react";
import { View } from "react-native";
import styles from "../styles";
import { MAPX_FILE_PATH } from "../utils";
import
{ Rect, MGMapView,
    Dot,
    GraphicPolylin,
    GraphicMultiPoint,
    GraphicPolygon,
} from "@mapgis/mobile-react-native";

/**
 * @content 坐标添加点
 * @author fjl 2019-7-26 下午2:52:36
 */
export default class MapGraphicPoint extends Component {
    static navigationOptions = { title: "坐标添加点" };
    onGetInstance = mapView => {
        this.mapView = mapView;
        this.openMap();
    };

    openMap = async () => {
        await this.mapView.loadFromFile(MAPX_FILE_PATH);

        var dotModule = new Dot();
        var dotArray = [];
        var dot1 = await dotModule.createObj(12697530, 3593327);
        var dot2 = await dotModule.createObj(12736224, 3570660);
        var dot3 = await dotModule.createObj(12766215, 3612566);
        dotArray.push(dot1);
        dotArray.push(dot2);
        dotArray.push(dot3);
        var graphicMultiPointModule = new GraphicMultiPoint();
        this.graphicMultiPoint = await graphicMultiPointModule.createObj();
        console.log("graphicMultiPointModule:" + this.graphicMultiPoint._MGGraphicMultiPointId);
        await this.graphicMultiPoint.setColor("rgba(100, 200, 0, 12)");
        await this.graphicMultiPoint.setPointSize(20);
        await this.graphicMultiPoint.setPoints(dotArray);

        this.graphicsOverlay =   await this.mapView.getGraphicsOverlay();
        await this.graphicsOverlay.addGraphic(this.graphicMultiPoint);
    };

    render() {
        return (
            <View style={styles.container}>
                <MGMapView
                    ref="mapView"
                    onGetInstance={this.onGetInstance}
                    style={styles.mapView}
                />
            </View>
        );
    }
}
