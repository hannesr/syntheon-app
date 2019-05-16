import React, {Component} from 'react';
import {View, Text, StatusBar, ScrollView, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Message from './Message'
import BigSlider from './BigSlider'
import BigSwitch from './BigSwitch'
import BigButton from './BigButton'
import RemoteConnection from './RemoteConnection';

class SynthScreen extends React.Component {

  constructor(props) {
    console.log(`... SynthScreen.constructor`);
    super(props);
    this.state = {message:null, initializing: false, synthControls: [], bank: []};
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
        <ScrollView>
        <View style={styles.row}>
          <BigSwitch
            label="Synth ON"
            value={this.state.synthService}
            onChanged={(val) => this.onSynthService(val)}
          />
          <BigSwitch
            label="Synth effect"
            value={this.state.synthEffect}
            onChanged={(val) => this.onSynthEffect(val)}
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
        <FlatList
          data={this.state.bank}
          extraData={this.state}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <BigButton
              title={item.name}
              onPress={() => this.onPreset(item.id)}
            />
          )}
        />
        </ScrollView>
      </View>
    );
  }

  async onInit() {
    console.log(`... SynthScreen.onInit`);
    this.setState({initializing: true, message: "Getting synth status..."});
    try {
      // Check bank checksum
      const bank_cs = await this.remote.getSynthBankCs();
      const local_cs = await AsyncStorage.getItem('@syntheon.synth.bank.cs');
      console.log(`... SynthScreen.onInit: bank_cs=${bank_cs}, local_cs=${local_cs}`);
      if (local_cs == bank_cs) {
        const bank = JSON.parse(await AsyncStorage.getItem('@syntheon.synth.bank.json'));
        this.setState({bank: bank});
      } else {
        let bank = await this.remote.getSynthBank();
        bank = bank.map((d,i) => ({id:i, name:d}));
        console.log(`... SynthScreen bank received: ${bank}`);
        await AsyncStorage.setItem('@syntheon.synth.bank.cs', bank_cs);
        await AsyncStorage.setItem('@syntheon.synth.bank.json', JSON.stringify(bank));
        this.setState({bank: bank});
      }
      // read states from remote
      const synthService = await this.remote.getSynthServiceState();
      this.setState({synthService: synthService})
      const synthEffect = await this.remote.getSynthEffectState();
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

  onSynthService(state) {
    this.remote.setSynthServiceState(state);
    this.setState({synthService: state})
  }

  onSynthEffect(state) {
    this.remote.setSynthEffectState(state);
    this.setState({synthEffect: state})
  }

  async onPreset(preset) {
    console.log(`... SynthScreen.onPreset ${preset}`);
    try {
      await this.remote.setSynthPreset(preset);
    } catch(err) {
      console.log(`... SynthScreen.onPreset failed: ${err}`);
      this.setState({message: err.toString()});
    }
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
