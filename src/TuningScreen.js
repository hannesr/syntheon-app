import React, {Component} from 'react';
import {View, Text, StatusBar, FlatList, Slider, StyleSheet} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Message from './Message'
import BigSlider from './BigSlider'
import RemoteConnection from './RemoteConnection';
import Actions from './actions/Actions';

class TuningScreen extends React.Component {

  constructor(props) {
    console.log("... TuningScreen.constructor");
    super(props);
    this.state = {effects:[]};
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
    this.props.message("Getting effect bank...", true);

    try {
      let eff = await this.remote.getEffectControlList();
      eff = eff.map((e,i) => ({id: i, title: e, value: i==0 ? 100 : 50}));
      this.setState({effects: eff});
      console.log(`... TuningScreen.onInit complete`);
      this.props.message(null);
    } catch(err) {
      console.log(`... TuningScreen.onInit failed: ${err}`);
      this.setState({message: err.toString(), initializing: false});
      this.props.message(err.toString());
    }
  }

}

const styles = StyleSheet.create({
  main: {
    marginBottom: 46
  }
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default connect(null, mapDispatchToProps)(TuningScreen)
