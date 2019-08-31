import React, {Component} from 'react';
import {View, Text, StatusBar, ScrollView, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Message from './Message'
import BigButton from './BigButton';
import BigSwitch from './BigSwitch';
import RemoteConnection from './RemoteConnection';
import Actions from './actions/Actions';

class BankScreen extends React.Component {

  constructor(props) {
    console.log("... BankScreen.constructor");
    super(props);
    this.state = {bank:[], presetStatus:false, preset:0};
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
    return (
      <View style={styles.main}>
        <StatusBar backgroundColor="#145f9a" barStyle="light-content" />
        <Message />
        <ScrollView>
        <View style={styles.row}>
          <BigSwitch
            label="Effect ON"
            value={this.state.presetStatus}
            onChanged={(val) => this.onPresetStatus(val)}
          />
        </View>
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
        </ScrollView>
      </View>
    );
  }

  async onInit() {
    console.log(`... BankScreen.onInit`);
    this.props.message("Getting sound bank...", true);
    try {
      // Check bank checksum
      const bank_cs = await this.remote.getEffectBankCs();
      const local_cs = await AsyncStorage.getItem('@syntheon.bank.cs');
      console.log(`... BankScreen.onInit: bank_cs=${bank_cs}, local_cs=${local_cs}`);
      if (local_cs == bank_cs) {
        const bank = JSON.parse(await AsyncStorage.getItem('@syntheon.bank.json'));
        this.setState({bank: bank});
      } else {
        let bank = await this.remote.getEffectBank();
        bank = bank.map((d,i) => ({id:i, name:d}));
        console.log(`... BankScreen bank received: ${bank}`);
        await AsyncStorage.setItem('@syntheon.bank.cs', bank_cs);
        await AsyncStorage.setItem('@syntheon.bank.json', JSON.stringify(bank));
        this.setState({bank: bank});
      }
      // read preset from remote
      const presetStatus = await this.remote.getEffectState();
      const preset = await this.remote.getEffectPreset();
      this.setState({presetStatus: presetStatus, preset: preset});
      console.log(`... BankScreen init complete`);
      this.props.message(null);
    } catch(err) {
      console.log(`... BankScreen.onInit failed: ${err}`);
      this.props.message(err.toString());
    }
  }

  async onPresetStatus(status) {
    console.log(`... BankScreen.onPresetStatus ${status}`);
    try {
      await this.remote.setEffectState(status);
      this.setState({presetStatus: status});
    } catch(err) {
      console.log(`... BankScreen.onEffectState failed: ${err}`);
      this.props.message(err.toString());
    }
  }

  async onPreset(preset) {
    console.log(`... BankScreen.onPreset ${this.state.preset} -> ${preset}`);
    try {
      await this.remote.setEffectPreset(preset);
      this.setState({preset: preset});
    } catch(err) {
      console.log(`... BankScreen.onPreset failed: ${err}`);
      this.props.message(err.toString());
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

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default connect(null, mapDispatchToProps)(BankScreen)
