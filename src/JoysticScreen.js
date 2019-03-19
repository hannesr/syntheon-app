import React, {Component} from 'react';
import {View, Text, StatusBar, FlatList, StyleSheet} from 'react-native';

import Message from './Message'
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
        <Text>
          This screen will have some pretty
          cool effects but not done yet
        </Text>
      </View>
    );
  }

  async onInit() {
    console.log("... JoysticScreen.onInit");
  }

}

const styles = StyleSheet.create({
  main: {
    marginBottom: 46
  }
});

export default JoysticScreen;
