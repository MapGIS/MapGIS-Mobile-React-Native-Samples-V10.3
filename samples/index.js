import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import samples from './samples';

const RootStack = createStackNavigator(samples, {
  defaultNavigationOptions: {
    headerTintColor: '#fff',
    headerStyle: {
      backgroundColor: '#292c36',
    },
  },
});

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
