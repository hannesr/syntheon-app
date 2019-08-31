import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator, createBottomTabNavigator, createAppContainer} from "react-navigation";
import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import {Provider} from 'react-redux'

import ScanScreen from './ScanScreen';
import BankScreen from './BankScreen';
import TuningScreen from './TuningScreen';
import JoysticScreen from './JoysticScreen';
import SynthScreen from './SynthScreen';
import appReducer from './state/Reducers'

const MainNavigator = createBottomTabNavigator(
  {
    Bank: BankScreen,
    Tuning: TuningScreen,
    Joystic: JoysticScreen,
    Synth: SynthScreen
  }, {
    initialRouteName: "Bank",
    defaultNavigationOptions: ({navigation}) => ({
      tabBarOptions: {
        showIcon: false,
        activeTintColor: 'black',
        activeBackgroundColor: '#c8deef',
        labelStyle: { fontSize: 16 }
      }
    })
  }
);

const App = createAppContainer(
  createStackNavigator({
    Scan: ScanScreen,
    Main: MainNavigator
  },{
    initialRouteName: "Scan",
    defaultNavigationOptions: ({navigation}) => ({
      title: (navigation.state.routeName=='Scan') ?
        'Scan' : navigation.state.params.title
    })
  })
);

const loggerMiddleware = createLogger({colors: {}})
const store = createStore(
  appReducer,
  applyMiddleware(thunkMiddleware, loggerMiddleware)
);

const AppContainer = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default AppContainer;
