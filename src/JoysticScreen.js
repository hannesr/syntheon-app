import React, {Component} from 'react';
import {View, Text, StatusBar, Picker, StyleSheet} from 'react-native';

import Message from './Message'
import Joystic from './Joystic'
import RemoteConnection from './RemoteConnection';

class JoysticScreen extends React.Component {

  constructor(props) {
    console.log("... JoysticScreen.constructor");
    super(props);
    this.state = {message:null, initializing: false, effects: [], keys: [1, 2]};
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
        <View style={styles.pickerrow}>
          {this.renderEffectSelect(0)}
          {this.renderEffectSelect(1)}
        </View>
        <Joystic
          x={50} y={50}
          onValueChanged={(x,y,f) => {this.onEffect(x,y,f)}}
        />
      </View>
    );
  }

  renderEffectSelect(index) {
    const pickerItems = this.state.effects.map(effect => (
      <Picker.Item key={effect.id.toString()}
        value={effect.id}
        label={effect.title} />
    ));
    return (
      <Picker style={styles.picker}
        selectedValue={this.state.keys[index]}
        onValueChange={(val) => this.onEffectSelect(index, val)}
      >
        {pickerItems}
      </Picker>
    );
  }

  async onInit() {
    console.log(`... JoysticScreen.onInit`);
    this.setState({initializing: true, message: "Getting effect bank..."});
    this.timestamp = new Date();

    try {
      let eff = await this.remote.getEffectsList();
      eff = eff.map((e,i) => ({id: i, title: e}))
      this.setState({effects: eff})
      console.log(`... JoysticScreen.onInit complete`);
      this.setState({message: null, initializing: false});
    } catch(err) {
      console.log(`... TuningScreen.onInit failed: ${err}`);
      this.setState({message: err.toString(), initializing: false});
    }
  }

  onEffectSelect(index, key) {
    this.setState(state => {
      let k = state.keys; k[index]=key;
      return {keys: k};
    });
  }

  onEffect(val0, val1, force) {
    let ts = new Date();
    if (ts - this.timestamp > 200 || force) {
      this.timestamp = ts;
      this.remote.setEffects(
        this.state.keys[0], Math.round(val0),
        this.state.keys[1], Math.round(val1));
    }
  }
}

const styles = StyleSheet.create({
  main: {
    marginBottom: 46
  },
  pickerrow: {
    flexDirection: 'row'
  },
  picker: {
    width: '50%'
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
