import React, {Component} from 'react';
import {View, Text, StatusBar, FlatList, Slider, StyleSheet} from 'react-native';

import Message from './Message'
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
            <View style={styles.sliderframe}>
              <Text style={styles.slidertext}>{item.title}</Text>
              <Slider
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={item.value}
                minimumTrackTintColor='#2196F3'
                maximumTrackTintColor='#c8deef'
                thumbTintColor='#145f9a'
                onValueChange={(value) => this.onEffect(item.id, value)}
                onSlidingComplete={(value) => this.onEffect(item.id, value, true)}
              />
            </View>
          )}
        />
      </View>
    );
  }

  async onInit() {
    console.log(`... TuningScreen.onInit`);
    this.setState({initializing: true, message: "Getting effect bank..."});
    this.timestamp = new Date();

    try {
      let eff = await this.remote.getEffects();
      eff = eff.map((e,i) => ({id: i, title: e, value: i==0 ? 100 : 50}))
      this.setState({effects: eff})
      console.log(`... TuningScreen.onInit complete`);
      this.setState({message: null, initializing: false});
    } catch(err) {
      console.log(`... TuningScreen.onInit failed: ${err}`);
      this.setState({message: err, initializing: false});
    }
  }

  onEffect(key, value, force=false) {
    let ts = new Date();
    if (ts - this.timestamp > 200 || force) {
      this.timestamp = ts;
      this.remote.setEffect(key, value);
    }
  }

}

const styles = StyleSheet.create({
  main: {
    marginBottom: 46
  },
  sliderframe: {
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8
  },
  slidertext: {
    marginLeft: 8,
    color: '#145f9a'
  }
});

export default TuningScreen;
