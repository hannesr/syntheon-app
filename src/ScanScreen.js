import React from 'react';
import {View, Text, StatusBar, FlatList, StyleSheet} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Message from './Message'
import BigButton from './BigButton';
//import RemoteConnection from './RemoteConnection';
import Actions from './actions/Actions';

class ScanScreen extends React.Component {

  constructor(props) {
    console.log("... ScanScreen.constructor");
    super(props);
    this.state = {devices: []};
  }

  componentDidMount() {
    console.log("... ScanScreen.componentDidMount");
    this.props.message("Scanning devices...", true);
    this.props.startScan();
    this.props.navigation.addListener('didFocus', () => {
      console.log("... ScanScreen.didFocus");
      this.props.disconnectDevice();
    })
  }

  componentWillUnmount() {
    console.log("... ScanScreen.componentWillUnmount");
  }

  render() {
    return (
      <View style={styles.main}>
        <StatusBar backgroundColor="#145f9a" barStyle="light-content" />
        <Message />
        <FlatList
          data={this.props.devices}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <BigButton
              title={item.name}
              onPress={() => this.onDeviceSelect(item)}
            />
          )}
        />
      </View>
    );
  }

  onDeviceSelect(device) {
    console.log(`... ScanScreen.onDeviceSelect: ${device.name}`);
    this.props.stopScan();
    this.props.message(`Connecting to ${device.name}...`);
    try {
      this.props.connectDevice(device);
      console.log(`... ScanScreen: connected`);
      this.props.message(null);
      this.props.navigation.navigate('Main', {title: device.name});
    } catch(err) {
      console.log(`... ScanScreen: connection failed: ${err}`);
      this.props.message(err.toString());
    }
  }

}

const styles = StyleSheet.create({
  main: {
    marginBottom: 46
  }
});

const mapStateToProps = (state) => {
  return {
    devices: state.devices,
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScanScreen)
