import React, { Component } from 'react';
import { StyleSheet,DeviceEventEmitter } from 'react-native';
import Switch from './switch';

const style = StyleSheet.create({
  switch: {
    marginRight: 16,
  },
});

class SwitchButton extends Component {
  state = { value: true };

  onValueChange = () => {
    DeviceEventEmitter.emit('change', !this.state.value);
    this.setState({ value: !this.state.value });
  };

  render() {
    return (
      <Switch
        style={style.switch}
        value={this.state.value}
        onValueChange={this.onValueChange}
      />
    );
  }
}

export default class SwitchScreen extends Component {
  static navigationOptions = {
    headerRight: <SwitchButton />,
  };

  componentWillUnmount() {
    this.listener.remove();
  }

  listener = DeviceEventEmitter.addListener('change', value => this.onSwitch(value));
}
