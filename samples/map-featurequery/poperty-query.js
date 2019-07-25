import React, { Component } from "react";
import {View, ToastAndroid, TouchableOpacity, Text} from "react-native";
import styles from "../styles";
import { MAPX_FILE_PATH } from "../utils";
import { Rect, MGMapView,
    Dot,
    PointF,
    QueryBound,
    FeatureQuery,
} from "@mapgis/mobile-react-native";

export default class MapPopertyQuery extends Component {
    static navigationOptions = { title: "属性查询" };
    onGetInstance = mapView => {
        this.mapView = mapView;
        this.openMap();

    };

    openMap = async () => {
        await this.mapView.loadFromFile(MAPX_FILE_PATH);


    };

    featureQuery = async () => {
        var map = await this.mapView.getMap();
        var mapLayer = await map.getLayer(3);
        console.log("mapLayer.getName:" + await mapLayer.getName());

        var featureQuery = new FeatureQuery();
        var query = await featureQuery.createObjByProperty(mapLayer);
        await query.setWhereClause("Name like '%通%'");
        var featurePagedResult = await query.query();

        console.log("featurePagedResult:" + await featurePagedResult._MGFeaturePagedResultId);
        var pagecount = await featurePagedResult.getPageCount();
        var getTotalFeatureCount = await featurePagedResult.getTotalFeatureCount();

        var featureLst = await featurePagedResult.getPage(1);
        for (var i = 0; i < featureLst.length; i++) {
            var feature = await featureLst[i];
            var attributes = await feature.getAttributes();
            console.log("getAttributes:" + attributes);
        }

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
                <View style={styles.buttons}>
                    <View style={styles.button}>
                        <TouchableOpacity onPress={this.featureQuery}>
                            <Text style={styles.text}>属性查询</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}
