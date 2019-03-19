import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator, createBottomTabNavigator, createAppContainer} from "react-navigation";

import ScanScreen from './ScanScreen';
import BankScreen from './BankScreen';
import JoysticScreen from './JoysticScreen';

const MainNavigator = createBottomTabNavigator(
  {
    Bank: BankScreen,
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

/*
const App = createAppContainer(
  createStackNavigator({
    Scan: {
      screen: ScanScreen,
      navigationOptions: ({navigation}) => ({ title: "Scan" })
    },
    Main: {
      screen: Main,
      navigationOptions: ({navigation}) => ({ title: navigation.state.params.title })
    }
  },{
    initialRouteName: "Scan"
  })
);
*/

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

/*
type Props = {};
class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Syntheon</Text>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default App;

*/
