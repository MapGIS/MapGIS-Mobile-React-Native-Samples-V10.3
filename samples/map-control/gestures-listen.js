import React, {Component} from "react";
import {FlatList, StyleSheet, Text, View,DeviceEventEmitter } from "react-native";
import styles from "../styles";
import {MAPX_FILE_PATH} from "../utils";
import {MGMapView} from "@mapgis/mobile-react-native";
import {Switch} from "../common";

export default class MapGesturesListen extends Component {
    static navigationOptions = {title: "地图手势事件监听"};

    constructor() {
        super();
        this.state = {
            TapListen: true,
            twoFingerTapZooming: true,
            mapZoomGesturesEnabled: true,
            mapPanGesturesEnabled: true,
            mapSlopeGestures: true,
            mpRotateGestures: true,
            logs: []
        };
    }

    onGetInstance = mapView => {
        this.mapView = mapView;
        this.openMap();
    };

    openMap = async () => {
        await this.mapView.loadFromFile(MAPX_FILE_PATH);
        await this.mapView.setTapListener();

    };

    componentDidMount() {
        DeviceEventEmitter.addListener("com.mapgis.RN.Mapview.single_tap_event", (res) => {

            console.log("我是单击事件监听");
            console.log(res);
            //遍历对象所有数据
            var str = '';
            for (var item in res) {
                str += item + ":" + res[item] + "\n";
            }
            console.log("fjl:" + str);

            return data => {
                this.setState({
                    logs: [
                        {
                            key: Math.random().toString(),
                            time: new Date().toLocaleString(),
                            data: JSON.stringify(data, null, 2)
                        },
                        ...this.state.logs
                    ]
                });
            };

        });
    }

    logger(event) {
        return data => {
            this.setState({
                logs: [
                    {
                        event,
                        key: Math.random().toString(),
                        time: new Date().toLocaleString(),
                        data: JSON.stringify(data, null, 2)
                    },
                    ...this.state.logs
                ]
            });
        };
    }

    renderItem = ({ item }) => (
        <View style={style.item}>
            <View style={style.itemHeader}>
                <Text style={style.time}>{item.time}</Text>
                <Text style={style.label}>{item.event}</Text>
            </View>
            {item.data !== "{}" && <Text style={style.data}>{item.data}</Text>}
        </View>
    );

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.columnControls}>
                    <View style={styles.columnControl}>
                        <Text style={styles.columnLabel}>放大（单指双击）</Text>
                        <Switch
                            onValueChange={async TapListen => {
                                this.setState({TapListen});
                                if(TapListen == true)
                                {
                                    await this.mapView.setTapListener();
                                }
                                else {
                                    await this.mapView.setTapListener(null);
                                }

                            }}
                            value={this.state.TapListen}
                        />
                    </View>
                    <View style={styles.columnControl}>
                        <Text style={styles.columnLabel}>缩小（双指单击）</Text>
                        <Switch
                            onValueChange={async twoFingerTapZooming => {
                                this.setState({twoFingerTapZooming});
                                await this.mapView.setTwoFingerTapZooming(twoFingerTapZooming);
                                await this.mapView.refresh();
                            }}
                            value={this.state.twoFingerTapZooming}
                        />
                    </View>
                    <View style={styles.columnControl}>
                        <Text style={styles.columnLabel}>自由缩放</Text>
                        <Switch
                            onValueChange={async mapZoomGesturesEnabled => {
                                this.setState({mapZoomGesturesEnabled});
                                await this.mapView.setMapZoomGesturesEnabled(mapZoomGesturesEnabled);
                                await this.mapView.refresh();
                            }}
                            value={this.state.mapZoomGesturesEnabled}
                        />
                    </View>
                    <View style={styles.columnControl}>
                        <Text style={styles.columnLabel}>滑动手势</Text>
                        <Switch
                            onValueChange={async mapPanGesturesEnabled => {
                                this.setState({mapPanGesturesEnabled});
                                await this.mapView.setMapPanGesturesEnabled(mapPanGesturesEnabled);
                                await this.mapView.refresh();
                            }}
                            value={this.state.mapPanGesturesEnabled}
                        />
                    </View>
                    <View style={styles.columnControl}>
                        <Text style={styles.columnLabel}>倾斜（双指竖直下滑）</Text>
                        <Switch
                            onValueChange={async mapSlopeGestures => {
                                this.setState({mapSlopeGestures});
                                await this.mapView.setMapSlopeGesturesEnabled(mapSlopeGestures);
                                await this.mapView.refresh();
                            }}
                            value={this.state.mapSlopeGestures}
                        />
                    </View>
                    <View style={styles.columnControl}>
                        <Text style={styles.columnLabel}> 双指旋转地图</Text>
                        <Switch
                            onValueChange={async mpRotateGestures => {
                                this.setState({mpRotateGestures});
                                await this.mapView.setMapRotateGesturesEnabled(mpRotateGestures);
                                await this.mapView.refresh();
                            }}
                            value={this.state.mpRotateGestures}
                        />
                    </View>

                </View>
                <MGMapView
                    ref="mapView"
                    onGetInstance={this.onGetInstance}
                    style={styles.mapView}
                />
                <FlatList style={style.logs} data={this.state.logs} renderItem={this.renderItem} />
            </View>
        );
    }

}

const style = StyleSheet.create({
    full: {
        flex: 1
    },
    logs: {
        flex: 1,
        elevation: 8,
        backgroundColor: "#292c36"
    },
    item: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10
    },
    itemHeader: {
        flexDirection: "row"
    },
    time: {
        color: "#757575",
        fontSize: 12
    },
    label: {
        marginLeft: 8,
        color: "#f5533d",
        fontSize: 12
    },
    data: {
        color: "#eee",
        fontSize: 12
    }
});
