import React, {Component} from "react";
import {FlatList, StyleSheet, Text, View,DeviceEventEmitter } from "react-native";
import styles from "../styles";
import {MAPX_FILE_PATH} from "../utils";
import {MGMapView} from "@mapgis/mobile-react-native";
import {Switch} from "../common";

/**
 * @content 地图手势事件监听
 * @author fjl 2019-7-25 下午2:52:36
 */
export default class MapGesturesListen extends Component {
    static navigationOptions = {title: "地图手势事件监听"};

    constructor() {
        super();
        this.state = {
            TapListen: true,
            DoubleTapListen: false,
            LongTapListen: false,
            TouchTapListen: false,
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
        // await this.mapView.setDoubleTapListener();
        // await this.mapView.setLongTapListener();
        // await this.mapView.setTouchListener();
        console.log("openMap:" + "openMap");
    };

    componentDidMount() {
        DeviceEventEmitter.addListener("com.mapgis.RN.Mapview.single_tap_event", (res) => {

                this.setState({
                    logs: [
                        {
                            Type:"单击事件监听",
                            key: Math.random().toString(),
                            time: new Date().toLocaleString(),
                            data: JSON.stringify(res, null, 2)
                        },
                    ]
                });


        });

        DeviceEventEmitter.addListener("com.mapgis.RN.Mapview.double_tap_event", (res) => {

            this.setState({
                logs: [
                    {
                        Type:"双击事件监听",
                        key: Math.random().toString(),
                        time: new Date().toLocaleString(),
                        data: JSON.stringify(res, null, 2)
                    },
                    // ...this.state.logs
                ]
            });


        });

        DeviceEventEmitter.addListener("com.mapgis.RN.Mapview.long_tap_event", (res) => {

            this.setState({
                logs: [
                    {
                        Type:"长按事件监听",
                        key: Math.random().toString(),
                        time: new Date().toLocaleString(),
                        data: JSON.stringify(res, null, 2)
                    },
                ]
            });


        });

        DeviceEventEmitter.addListener("com.mapgis.RN.Mapview.touch_event", (res) => {

            this.setState({
                logs: [
                    {
                        Type:"触摸事件监听",
                        key: Math.random().toString(),
                        time: new Date().toLocaleString(),
                        data: JSON.stringify(res, null, 2)
                    },
                ]
            });


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
                <Text style={style.label}>{item.Type}</Text>
                <Text style={style.time}>{item.time}</Text>
                <Text style={style.label}>{item.event}</Text>
            </View>
            {item.data !== "{}" && <Text style={style.data}>{item.data}</Text>}
        </View>
    );

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.controls}>
                    <View style={styles.control}>
                        <Text style={styles.label}>短按监听</Text>
                        <Switch
                            onValueChange={async TapListen => {
                                this.setState({TapListen});
                                if(TapListen == true)
                                {
                                    await this.mapView.setTapListener();
                                    console.log("TapListen:" + TapListen);
                                }
                                else {
                                    console.log("TapListen:" + TapListen);
                                    await this.mapView.removeTapListener();
                                }

                            }}
                            value={this.state.TapListen}
                        />
                    </View>
                    <View style={styles.control}>
                        <Text style={styles.label}>长按监听</Text>
                        <Switch
                            onValueChange={async LongTapListen => {
                                this.setState({LongTapListen});
                                if(LongTapListen == true)
                                {
                                    await this.mapView.setLongTapListener();
                                }
                                else {
                                    await this.mapView.removeLongTapListener();
                                }
                            }}
                            value={this.state.LongTapListen}
                        />
                    </View>
                    <View style={styles.control}>
                        <Text style={styles.label}>双击监听</Text>
                        <Switch
                            onValueChange={async DoubleTapListen => {
                                this.setState({DoubleTapListen});

                                if(DoubleTapListen == true)
                                {
                                    await this.mapView.setDoubleTapListener();
                                }
                                else {
                                    await this.mapView.removeDoubleTapListener();
                                    // DeviceEventEmitter.removeListener("com.mapgis.RN.Mapview.double_tap_event",(res) => {});
                                }

                            }}
                            value={this.state.DoubleTapListen}
                        />
                    </View>
                    <View style={styles.control}>
                        <Text style={styles.label}>触摸监听</Text>
                        <Switch
                            onValueChange={async TouchTapListen => {
                                this.setState({TouchTapListen});

                                if(TouchTapListen == true)
                                {
                                    console.log("TouchTapListen:" + TouchTapListen);
                                    await this.mapView.setTouchListener();
                                }
                                else {
                                    console.log("TouchTapListen:" + TouchTapListen);
                                    await this.mapView.removeTouchListener();
                                }
                            }}
                            value={this.state.TouchTapListen}
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

    container: {
        flexDirection: "column",
        position: "absolute",
        justifyContent: "space-between",
    },
    full: {
        flex: 1
    },
    logs: {
        flex: 1,
        height: 12,
        elevation: 8,
        backgroundColor: "#292c36",
        // backgroundColor: "rgba(41, 44, 54, 0.5)",
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
