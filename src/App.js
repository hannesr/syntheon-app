import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator, createBottomTabNavigator, createAppContainer} from "react-navigation";

import ScanScreen from './ScanScreen';
import BankScreen from './BankScreen';
import TuningScreen from './TuningScreen';
import JoysticScreen from './JoysticScreen';

const MainNavigator = createBottomTabNavigator(
  {
    Bank: BankScreen,
    Tuning: TuningScreen,
    Joystic: JoysticScreen
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

export default App;
