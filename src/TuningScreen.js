import React, {Component} from 'react';
import {View, Text, StatusBar, FlatList, Slider, StyleSheet} from 'react-native';

import Message from './Message'
import BigSlider from './BigSlider'
import RemoteConnection from './RemoteConnection';

class TuningScreen extends React.Component {

  constructor(props) {
    console.log("... TuningScreen.constructor");
    super(props);
    this.state = {message:null, initializing: false, effects:[]};
    this.remote = RemoteConnection.getInstance();
  }

  componentDidMount() {
    console.log("... TuningScreen.componentDidMount");
    this.onInit();
  }

  componentWillUnmount() {
    console.log("... TuningScreen.componentWillUnmount");
    this.remote.cancel();
    this.remote.disconnect();
  }

  render() {
    // TODO: disable all when bypassing effects
    return (
      <View style={styles.main}>
        <StatusBar backgroundColor="#145f9a" barStyle="light-content" />
        <Message text={this.state.message} spinner={this.state.initializing} />
        <FlatList
          data={this.state.effects}
          extraData={this.state}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <BigSlider
              title={item.title}
              value={item.value}
              onChanged={(value) => this.remote.setEffectControls(item.id, value)}
            />
          )}
        />
      </View>
    );
  }

  async onInit() {
    console.log(`... TuningScreen.onInit`);
    this.setState({initializing: true, message: "Getting effect bank..."});

    try {
      let eff = await this.remote.getEffectControlList();
      eff = eff.map((e,i) => ({id: i, title: e, value: i==0 ? 100 : 50}));
      this.setState({effects: eff});
      console.log(`... TuningScreen.onInit complete`);
      this.setState({message: null, initializing: false});
    } catch(err) {
      console.log(`... TuningScreen.onInit failed: ${err}`);
      this.setState({message: err.toString(), initializing: false});
    }
  }

}

const styles = StyleSheet.create({
  main: {
    marginBottom: 46
  }
});

export default TuningScreen;
