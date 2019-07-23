import React, {Component} from "react";
import {View} from "react-native";
import styles from "../styles";
import {MAPX_FILE_PATH} from "../utils";
import {
    Rect, MGMapView,
    Dot,
    PointF,
    Image,
    GraphicImage,
    GraphicText,
} from "@mapgis/mobile-react-native";

export default class MapGraphicImage extends Component {
    static navigationOptions = {title: "坐标添加图像"};
    onGetInstance = mapView => {
        this.mapView = mapView;
        this.openMap();
    };

    openMap = async () => {
        await this.mapView.loadFromFile(MAPX_FILE_PATH);
        var dot = new Dot();
        var center = await dot.createObj(12751000.589636726, 3568000.453292473);
        var image = new Image();
        var img = await image.createObj("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYzOTY1NzQ4OTA0NTExRTZBRTVBOEZFNDY1OTZDN0Q2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYzOTY1NzQ5OTA0NTExRTZBRTVBOEZFNDY1OTZDN0Q2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjM5NjU3NDY5MDQ1MTFFNkFFNUE4RkU0NjU5NkM3RDYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjM5NjU3NDc5MDQ1MTFFNkFFNUE4RkU0NjU5NkM3RDYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5JLeqoAAAJ0ElEQVR42tyc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");
        var gi = new GraphicImage();
        this.graphicImage = await gi.createObj();
        console.log("获取graphicImage的ID:" + this.graphicImage._MGGraphicImageId);
        await this.graphicImage.setImage(img);
        await this.graphicImage.setPoint(center);

        this.graphicsOverlay = await this.mapView.getGraphicsOverlay();
        await this.graphicsOverlay.addGraphic(this.graphicImage);
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
