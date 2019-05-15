import React, {Component} from 'react';
import {View, Text, StatusBar, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Message from './Message'
import BigButton from './BigButton';
import BigSwitch from './BigSwitch';
import RemoteConnection from './RemoteConnection';

class BankScreen extends React.Component {

  constructor(props) {
    console.log("... BankScreen.constructor");
    super(props);
    this.state = {message:null, initializing:false, bank:[], presetStatus:false, preset:0};
    this.remote = RemoteConnection.getInstance();
  }

  componentDidMount() {
    console.log("... BankScreen.componentDidMount");
    this.onInit();
  }

  componentWillUnmount() {
    console.log("... BankScreen.componentWillUnmount");
    this.remote.cancel();
  }

  render() {
    // TODO: Try to get Slider between Bypass and effects
    return (
      <View style={styles.main}>
        <StatusBar backgroundColor="#145f9a" barStyle="light-content" />
        <Message text={this.state.message} spinner={this.state.initializing} />
        <BigSwitch
          label="Effect ON"
          value={this.state.presetStatus}
          onChanged={(val) => this.onPresetStatus(val)}
        />
        <FlatList
          data={this.state.bank}
          extraData={this.state}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <BigButton
              title={item.name}
              active={this.state.preset==item.id}
              onPress={() => this.onPreset(item.id)}
            />
          )}
        />
      </View>
    );
  }

  async onInit() {
    console.log(`... BankScreen.onInit`);
    this.setState({initializing: true, message: "Getting sound bank..."});
    try {
      // Check bank checksum
      const bank_cs = await this.remote.getBankCs();
      const local_cs = await AsyncStorage.getItem('@syntheon.bank.cs');
      console.log(`... BankScreen.onInit: bank_cs=${bank_cs}, local_cs=${local_cs}`);
      if (local_cs == bank_cs) {
        const bank = JSON.parse(await AsyncStorage.getItem('@syntheon.bank.json'));
        this.setState({bank: bank});
      } else {
        let bank = await this.remote.getBank();
        bank = bank.map((d,i) => ({id:i, name:d}));
        bank[0].name = 'Bypass';
        console.log(`... BankScreen bank received: ${bank}`);
        await AsyncStorage.setItem('@syntheon.bank.cs', bank_cs);
        await AsyncStorage.setItem('@syntheon.bank.json', JSON.stringify(bank));
        this.setState({bank: bank});
      }
      // read preset from remote
      const presetStatus = await this.remote.getPresetOn();
      const preset = await this.remote.getPreset();
      this.setState({presetStatus: presetStatus, preset: preset});
      console.log(`... BankScreen init complete`);
      this.setState({message: null, initializing: false});
    } catch(err) {
      console.log(`... BankScreen.onInit failed: ${err}`);
      this.setState({message: err.toString(), initializing: false});
    }
  }

  async onPresetStatus(status) {
    console.log(`... BankScreen.onPresetStatus ${status}`);
    try {
      await this.remote.setPresetOn(status);
      this.setState({presetStatus: status});
    } catch(err) {
      console.log(`... BankScreen.onPresetStatus failed: ${err}`);
      this.setState({message: err.toString()});
    }
  }

  async onPreset(preset) {
    console.log(`... BankScreen.onPreset ${this.state.preset} -> ${preset}`);
    try {
      await this.remote.setPreset(preset);
      this.setState({preset: preset});
    } catch(err) {
      console.log(`... BankScreen.onPreset failed: ${err}`);
      this.setState({message: err.toString()});
    }
  }

}

const styles = StyleSheet.create({
  main: {
    marginBottom: 46
  }
});

export default BankScreen;
