import React, { Component } from "react";
import { View } from "react-native";
import styles from "../styles";
import { MAPX_FILE_PATH } from "../utils";
import { Rect, MGMapView,
    Dot,
    PointF,
    GraphicPolylin,
    GraphicMultiPoint,
    GraphicText,
} from "@mapgis/mobile-react-native";

export default class MapGraphicText extends Component {
    static navigationOptions = { title: "坐标添加文本" };
    onGetInstance = mapView => {
        this.mapView = mapView;
        this.openMap();
    };

    openMap = async () => {
        await this.mapView.loadFromFile(MAPX_FILE_PATH);
        var dotModule = new Dot();
        var dot = await dotModule.createObj(12737645.2, 3591028.9);

        var graphicTextModule = new GraphicText();
        this.graphicText = await graphicTextModule.createObj();
        console.log("获取graphicText的ID:" + this.graphicText._MGGraphicTextId);
        console.log("获取graphicText的ID:" + this.graphicText._MGGraphicId);
        await this.graphicText.setColor("rgba(255, 0, 0, 1)");
        await this.graphicText.setPoint(dot);
        await this.graphicText.setText("天兴洲");
        await this.graphicText.setFontSize(50);

        this.graphicsOverlay =   await this.mapView.getGraphicsOverlay();
        await this.graphicsOverlay.addGraphic(this.graphicText);
        await this.mapView.refresh();
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
