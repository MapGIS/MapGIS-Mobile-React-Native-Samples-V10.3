import React, {Component} from "react";
import {FlatList, StyleSheet, Text, View,DeviceEventEmitter } from "react-native";
import styles from "../styles";
import {MAPX_FILE_PATH} from "../utils";
import {MGMapView} from "@mapgis/mobile-react-native";
import {Switch} from "../common";

/**
 * @content 地图显示事件监听
 * @author fjl 2019-7-25 下午2:52:36
 */
export default class MapShowListen extends Component {
    static navigationOptions = {title: "地图显示事件监听"};

    constructor() {
        super();
        this.state = {
            TapListen: true,
            zoomChangeListen: true,
            angelChangeListen: true,
            centerchangelisten: true,
            animationchangelisten: true,
            refreshchangelisten: true,
            logs: []
        };
    }

    onGetInstance = mapView => {
        this.mapView = mapView;
        this.openMap();
    };

    openMap = async () => {
        await this.mapView.loadFromFile(MAPX_FILE_PATH);

        await this.mapView.setZoomChangedListener();
        await this.mapView.setRotateChangedListener();
        await this.mapView.setCenterChangedListener();
        // await this.mapView.setRefreshListener();
        await this.mapView.setAnimationListener();
    };

    componentDidMount() {

        DeviceEventEmitter.addListener("com.mapgis.RN.Mapview.zoomchanged_event", (res) => {

            this.setState({
                logs: [
                    {
                        Type:"级别变化监听",
                        key: Math.random().toString(),
                        time: new Date().toLocaleString(),
                        data: JSON.stringify(res, null, 2)
                    },
                    ...this.state.logs
                ]
            });
        });

        DeviceEventEmitter.addListener("com.mapgis.RN.Mapview.rotatechanged_event", (res) => {

            this.setState({
                logs: [
                    {
                        Type:"角度变化监听",
                        key: Math.random().toString(),
                        time: new Date().toLocaleString(),
                        data: JSON.stringify(res, null, 2)
                    },
                    ...this.state.logs
                ]
            });
        });

        DeviceEventEmitter.addListener("com.mapgis.RN.Mapview.centerchanged_event", (res) => {

            this.setState({
                logs: [
                    {
                        Type:"中心点改变监听",
                        key: Math.random().toString(),
                        time: new Date().toLocaleString(),
                        data: JSON.stringify(res, null, 2)
                    },
                    // ...this.state.logs
                ]
            });


        });

        DeviceEventEmitter.addListener("com.mapgis.RN.Mapview.RefreshListener", (res) => {

            this.setState({
                logs: [
                    {
                        Type:"刷新事件监听",
                        key: Math.random().toString(),
                        time: new Date().toLocaleString(),
                        data: JSON.stringify(res, null, 2)
                    },
                ]
            });

        });

        DeviceEventEmitter.addListener("com.mapgis.RN.Mapview.AnimationListener", (res) => {

            this.setState({
                logs: [
                    {
                        Type:"动画监听",
                        key: Math.random().toString(),
                        time: new Date().toLocaleString(),
                        data: JSON.stringify(res, null, 2)
                    },
                    ...this.state.logs
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
                {/*<View style={style.container}>*/}
                <View style={styles.controls}>
                    <View style={styles.control}>
                        <Text style={styles.label}>级别变化</Text>
                        <Switch
                            onValueChange={async zoomChangeListen => {
                                this.setState({zoomChangeListen});
                                if(zoomChangeListen == true)
                                {
                                    await this.mapView.setZoomChangedListener();
                                }
                                else {
                                    await this.mapView.removeZoomChangedListener();
                                }

                            }}
                            value={this.state.zoomChangeListen}
                        />
                    </View>
                    <View style={styles.control}>
                        <Text style={styles.label}>角度变化</Text>
                        <Switch
                            onValueChange={async angelChangeListen => {
                                this.setState({angelChangeListen});
                                if(angelChangeListen == true)
                                {
                                    await this.mapView.setRotateChangedListener();
                                }
                                else {
                                    await this.mapView.removeRotateChangedListener();
                                }
                                await this.mapView.refresh();

                            }}
                            value={this.state.angelChangeListen}
                        />
                    </View>
                    <View style={styles.control}>
                        <Text style={styles.label}>中心点变化</Text>
                        <Switch
                            onValueChange={async centerchangelisten => {
                                this.setState({centerchangelisten});
                                if(centerchangelisten == true)
                                {
                                    await this.mapView.setCenterChangedListener();
                                }
                                else {
                                    await this.mapView.removeCenterChangedListener();
                                }
                                await this.mapView.refresh();
                            }}
                            value={this.state.centerchangelisten}
                        />
                    </View>
                    <View style={styles.control}>
                        <Text style={styles.label}>动画监听</Text>
                        <Switch
                            onValueChange={async animationchangelisten => {
                                this.setState({animationchangelisten});
                                if(animationchangelisten == true)
                                {
                                    await this.mapView.setAnimationListener();
                                }
                                else {
                                    await this.mapView.removeAnimationListener();
                                }
                                await this.mapView.refresh();
                            }}
                            value={this.state.animationchangelisten}
                        />
                    </View>
                    <View style={styles.control}>
                        <Text style={styles.label}> 刷新监听</Text>
                        <Switch
                            onValueChange={async refreshchangelisten => {
                                this.setState({refreshchangelisten});
                                if(refreshchangelisten == true)
                                {
                                    await this.mapView.setRefreshListener();
                                }
                                else {
                                    await this.mapView.removeRefreshListener();
                                }
                                await this.mapView.refresh();
                            }}
                            value={this.state.refreshchangelisten}
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
