import React from 'react';
import { Switch } from 'react-native';

export default props => (
  <Switch
    trackColor="#f5533d"
    thumbColor={props.value ? '#f5533d' : '#f5f5f5'}
    {...props}
  />
);
