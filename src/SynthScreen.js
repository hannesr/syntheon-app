import React, {Component} from 'react';
import {View, Text, StatusBar, Switch, StyleSheet} from 'react-native';

import Message from './Message'
import BigSlider from './BigSlider'
import RemoteConnection from './RemoteConnection';

class SynthScreen extends React.Component {

  constructor(props) {
    console.log(`... SynthScreen.constructor`);
    super(props);
    this.state = {message:null, initializing: false};
    this.remote = RemoteConnection.getInstance();
  }

  componentDidMount() {
    console.log(`... SynthScreen.componentDidMount`);
    this.onInit();
  }

  componentWillUnmount() {
    console.log(`... SynthScreen.componentWillUnmount`);
    this.remote.cancel();
    this.remote.disconnect();
  }

  render() {
    return (
      <View style={styles.main}>
        <StatusBar backgroundColor="#145f9a" barStyle="light-content" />
        <Message text={this.state.message} spinner={this.state.initializing} />
        <View style={styles.row}>
          <Text style={styles.label}>Synth ON</Text>
          <Switch style={styles.switch}
            value={this.state.synthStatus}
            thumbColor='#2196F3' trackColor='#c8deef'
            onValueChange={(val) => this.setSynthStatus(val)} />
          <Text style={styles.label}>Synth effect</Text>
          <Switch style={styles.switch}
            value={this.state.synthEffect}
            thumbColor='#2196F3' trackColor='#c8deef'
            onValueChange={(val) => this.setSynthEffect(val)} />
        </View>
        <BigSlider
          title="Volume"
          value={this.state.synthVolume}
          onChanged={(value) => this.remote.setSynthVolume(value)}
        />
      </View>
    );
  }

  async onInit() {
    console.log(`... SynthScreen.onInit`);
    this.setState({initializing: true, message: "Getting synth status..."});
    try {
      const synthStatus = await this.remote.getSynthStatus();
      this.setState({synthStatus: synthStatus})
      const synthEffect = await this.remote.getSynthEffect();
      this.setState({synthEffect: synthEffect})
      const synthVolume = await this.remote.getSynthVolume();
      this.setState({synthVolume: synthVolume})
      console.log(`... SynthScreen.onInit complete`);
      this.setState({message: null, initializing: false});
    } catch(err) {
      console.log(`... SynthScreen.onInit failed: ${err}`);
      this.setState({message: err.toString(), initializing: false});
    }
  }

  setSynthStatus(status) {
    this.remote.setSynthStatus(status);
    this.setState({synthStatus: status})
  }

  setSynthEffect(status) {
    this.remote.setSynthEffect(status);
    this.setState({synthEffect: status})
  }

  setSynthVolume(volume) {
    this.remote.setSynthVolume(volume);
    this.setState({synthVolume: volume})
  }

}

const styles = StyleSheet.create({
  main: {
    marginBottom: 46
  },
  row: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center'
  },
  label: {
    marginLeft: 16,
  },
  switch: {
    marginLeft: 4,
  }
});

export default SynthScreen;
