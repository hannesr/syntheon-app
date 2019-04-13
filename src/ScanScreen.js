import React from 'react';
import {View, Text, StatusBar, FlatList, StyleSheet} from 'react-native';

import Message from './Message'
import BigButton from './BigButton';
import RemoteConnection from './RemoteConnection';

class ScanScreen extends React.Component {

  constructor(props) {
    console.log("... ScanScreen.constructor");
    super(props);
    this.state = {message:null, scanning:false, devices: []};
    this.remote = RemoteConnection.getInstance();
  }

  componentDidMount() {
    console.log("... ScanScreen.componentDidMount");
    this.onScan();
    this.props.navigation.addListener('didFocus', () => {
      console.log("... ScanScreen.didFocus");
      this.remote.disconnect();
    })
  }

  componentWillUnmount() {
    console.log("... ScanScreen.componentWillUnmount");
  }

  render() {
    return (
      <View style={styles.main}>
        <StatusBar backgroundColor="#145f9a" barStyle="light-content" />
        <Message text={this.state.message} spinner={this.state.scanning} />
        <FlatList
          data={this.state.devices}
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

  onScan() {
    this.setState({message: "Scanning devices..."});
    this.setState({scanning: true});
    this.remote.startScan(
      (d) => this.onDeviceFound(d),
      (err) => {
        console.log(`... ScanScreen: scan failed: ${err}`);
        this.setState({message: "Scan failed: "+err, scanning: false});
      }
    );
  }

  onDeviceFound(device) {
    if (this.state.devices.filter(d => d.id==device.id).length>0) return;
    console.log(`... ScanScreen: found device: ${JSON.stringify(device)}`);
    this.setState((state) => ({devices: state.devices.concat([device])}));
  }

  async onDeviceSelect(device) {
    console.log(`... ScanScreen.onDeviceSelect: ${device.name}`);
    this.remote.stopScan();
    this.setState({message: `Connecting to ${device.name}...`});
    try {
      await this.remote.connect(device);
      console.log(`... ScanScreen: connected`);
      this.setState({message:null, scanning: false});
      this.props.navigation.navigate('Main', {title: device.name});
    } catch(err) {
      console.log(`... ScanScreen: connection failed: ${err}`);
      this.setState({message: err.toString(), scanning: false});
    }
  }

}

const styles = StyleSheet.create({
  main: {
    marginBottom: 46
  }
});

export default ScanScreen;
