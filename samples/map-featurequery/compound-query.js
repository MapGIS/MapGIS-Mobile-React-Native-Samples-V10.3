import React, { Component } from "react";
import {View, ToastAndroid, TouchableOpacity, Text,Button, StyleSheet, TextInput} from "react-native";
import styles from "../styles";
import { MAPX_FILE_PATH } from "../utils";
import {
    Rect, MGMapView,
    Dot,
    PointF,
    QueryBound,
    FeatureQuery, GraphicPolygon,
} from "@mapgis/mobile-react-native";

/**
 * @content 复合查询
 * @author fjl 2019-7-25 下午2:52:36
 */
export default class MapCompoundQuery extends Component {
    static navigationOptions = { title: "复合查询" };
    onGetInstance = mapView => {
        this.mapView = mapView;
        this.openMap();

    };

    openMap = async () => {
        await this.mapView.loadFromFile(MAPX_FILE_PATH);

        var dotModule = new Dot();
        var dotArray = [];
        var intArr = [4];
        var dot1 = await dotModule.createObj(12730000, 3550000);
        var dot2 = await dotModule.createObj(12730000, 3580000);
        var dot3 = await dotModule.createObj(12760000, 3580000);
        var dot4 = await dotModule.createObj(12760000, 3550000);
        dotArray.push(dot1);
        dotArray.push(dot2);
        dotArray.push(dot3);
        dotArray.push(dot4);
        dotArray.push(dot1);
        var graphicPolygonModule = new GraphicPolygon();
        this.graphicPolygon = await graphicPolygonModule.createObj();
        console.log("获取graphicPolygon的ID:" + this.graphicPolygon._MGGraphicPolygonId);
        await this.graphicPolygon.setColor("rgba(50, 50, 50, 50)");
        await this.graphicPolygon.setBorderlineColor("rgba(20, 255, 0, 10)");
        await this.graphicPolygon.setPointSize(10);
        await this.graphicPolygon.setPoints(dotArray, null);

        this.graphicsOverlay = await this.mapView.getGraphicsOverlay();
        await this.graphicsOverlay.addGraphic(this.graphicPolygon);

        var R = new Rect();
        var quryRect = await R.createObj(12716197.610, 3522206.2847, 12772863.4857, 3611612.4442);
        await this.mapView.zoomToRange(quryRect,true);
        await this.mapView.refresh();
    };

    featureQuery = async () => {
        var R = new Rect();
        var quryRect = await R.createObj(12730000, 3550000, 12760000, 3580000);
        var qu = new QueryBound();
        var queryBound = await qu.createObj();
        await queryBound.setRect(quryRect);

        console.log("queryBoundid:" + queryBound._MGQueryBoundId);

        var map = await this.mapView.getMap();
        var mapLayer = await map.getLayer(3);
        console.log("mapLayer.getName:" + await mapLayer.getName());
        console.log("this.attr:" + "Name like '%"+this.attr+"%'");

        var featureQuery = new FeatureQuery();
        var query = await featureQuery.createObjByProperty(mapLayer);
        await query.setQueryBound(queryBound);
        // await query.setWhereClause("Name like '%湖%'");
        await query.setWhereClause("Name like '%"+this.attr+"%'");
        var featurePagedResult = await query.query();

        console.log("featurePagedResult:" + await featurePagedResult._MGFeaturePagedResultId);
        var pagecount = await featurePagedResult.getPageCount();
        var getTotalFeatureCount = await featurePagedResult.getTotalFeatureCount();

        var graphicArry = [];
        var featureLst = await featurePagedResult.getPage(1);
        for (var i = 0; i < featureLst.length; i++) {
            var feature = await featureLst[i];
            var attributes = await feature.getAttributes();
            console.log("getAttributes:" + attributes);

            var graphicList = await feature.toGraphics();
            for (var j =0; j < graphicList.length;j++)
            {
                console.log("_MGGraphicId:" + graphicList[j]._MGGraphicId);
                graphicArry.push(graphicList[j]);
            }
        }

        console.log(" graphicArry.length:" + graphicArry.length);
        this.graphicsOverlay =   await this.mapView.getGraphicsOverlay();
        await this.graphicsOverlay.addGraphics(graphicArry);
        await this.mapView.refresh();

        ToastAndroid.show('查询结果总数为：'+getTotalFeatureCount+"，请在console控制台查看！", ToastAndroid.SHORT);
        console.log("pagecount:" + pagecount);
        console.log("getTotalFeatureCount:" + getTotalFeatureCount);
        console.log("featureLst:" + featureLst.length);
    };

    render() {
        return (
            <View style={styles.container}>
                <MGMapView
                    ref="mapView"
                    onGetInstance={this.onGetInstance}
                    style={styles.mapView}
                />

                <View style={style.form}>
                    <TextInput
                        style={style.input}
                        returnKeyType="search"
                        placeholder="请输入查询的属性，例如：湖"
                        placeholderTextColor="#9e9e9e"
                        onChangeText={text => (this.attr = text)}
                        onSubmitEditing={this.search}
                    />
                    <Button title="复合查询" onPress={this.featureQuery} />
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#292c36"
    },
    form: {
        padding: 15
    },
    mapView: {
        flex: 1
    },
    input: {
        color: "#000",
        fontSize: 16,
        marginTop:15,
        // marginBottom: 15
    }
});
