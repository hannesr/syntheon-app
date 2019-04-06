import React, {Component} from 'react';
import {View, Text, StatusBar, FlatList, StyleSheet} from 'react-native';

import Message from './Message'
import Joystic from './Joystic'
import RemoteConnection from './RemoteConnection';

class JoysticScreen extends React.Component {

  constructor(props) {
    console.log("... JoysticScreen.constructor");
    super(props);
    this.state = {message:null};
    this.remote = RemoteConnection.getInstance();
  }

  componentDidMount() {
    console.log("... JoysticScreen.componentDidMount");
    this.onInit();
  }

  componentWillUnmount() {
    console.log("... JoysticScreen.componentWillUnmount");
    this.remote.cancel();
    this.remote.disconnect();
  }

  render() {
    return (
      <View style={styles.main}>
        <StatusBar backgroundColor="#145f9a" barStyle="light-content" />
        <Message text={this.state.message} />
        <Joystic
          x={50} y={50}
          onValueChanged={(x,y) => {this.onEffect(x,y)}}
        />
      </View>
    );
  }

  async onInit() {
    console.log("... JoysticScreen.onInit");
  }

  onEffect(val1, val2) {
    console.log(`... JoysticScreen.onEffect ${val1}, ${val2}`);
  }
}

const styles = StyleSheet.create({
  main: {
    marginBottom: 46
  },
  joystic: {
    height: 100,
    borderRadius: 200,
    backgroundColor: '#2196F3',
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8
  }
});

export default JoysticScreen;
