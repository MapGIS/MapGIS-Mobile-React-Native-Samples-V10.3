import React, { Component } from "react";
import {View, ToastAndroid, TouchableOpacity, Text,Button, StyleSheet, TextInput} from "react-native";
import styles from "../styles";
import { MAPX_FILE_PATH } from "../utils";
import { Rect, MGMapView,
    Dot,
    PointF,
    QueryBound,
    FeatureQuery,
} from "@mapgis/mobile-react-native";

/**
 * @content 属性查询
 * @author fjl 2019-7-25 下午2:52:36
 */
export default class MapPopertyQuery extends Component {
    static navigationOptions = { title: "属性查询" };
    onGetInstance = mapView => {
        this.mapView = mapView;
        this.openMap();

    };

    openMap = async () => {
        await this.mapView.loadFromFile(MAPX_FILE_PATH);


    };

    _featureQuery = async () => {
        var map = await this.mapView.getMap();
        var mapLayer = await map.getLayer(3);
        console.log("mapLayer.getName:" + await mapLayer.getName());

        var featureQuery = new FeatureQuery();
        var query = await featureQuery.createObjByProperty(mapLayer);
        // await query.setWhereClause("Name like '%通%'");
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
                        placeholder="请输入查询的属性，例如：通"
                        placeholderTextColor="#9e9e9e"
                        onChangeText={text => (this.attr = text)}
                        onSubmitEditing={this.search}
                    />
                    <Button title="属性查询" onPress={this._featureQuery} />
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
