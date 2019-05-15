import React, {Component} from 'react';
import {View, Text, StatusBar, FlatList, StyleSheet} from 'react-native';

import Message from './Message'
import BigSlider from './BigSlider'
import BigSwitch from './BigSwitch'
import RemoteConnection from './RemoteConnection';

class SynthScreen extends React.Component {

  constructor(props) {
    console.log(`... SynthScreen.constructor`);
    super(props);
    this.state = {message:null, initializing: false, synthControls: []};
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
          <BigSwitch
            label="Synth ON"
            value={this.state.synthStatus}
            onChanged={(val) => this.setSynthStatus(val)}
          />
          <BigSwitch
            label="Synth effect"
            value={this.state.synthEffect}
            onChanged={(val) => this.setSynthEffect(val)}
          />
        </View>
        <FlatList
          data={this.state.synthControls}
          extraData={this.state}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <BigSlider
              title={item.title}
              value={item.value}
              onChanged={(value) => this.remote.setSynthControls(item.id, value)}
            />
          )}
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
      let ctrls = await this.remote.getSynthControlList();
      ctrls = ctrls.map((e,i) => ({id: i, title: e, value: 100}));
      this.setState({synthControls: ctrls})
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

}

const styles = StyleSheet.create({
  main: {
    marginBottom: 46
  },
  row: {
    flexDirection: 'row'
  }
});

export default SynthScreen;
