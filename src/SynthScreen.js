import React, {Component} from 'react';
import {View, Text, StatusBar, ScrollView, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Message from './Message'
import BigSlider from './BigSlider'
import BigSwitch from './BigSwitch'
import BigButton from './BigButton'
import Actions from './actions/Actions';

class SynthScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.main}>
        <StatusBar backgroundColor="#145f9a" barStyle="light-content" />
        <Message />
        <ScrollView>
        <FlatList
          data={this.props.controls}
          extraData={this.props}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <BigSwitch
              label={item.name}
              value={item.value}
              onChanged={(val) => this.props.setControl('zynaddsubfx', item.id, val)}
            />
          )}
        />
        <FlatList
          data={this.props.programs}
          extraData={this.props}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <BigButton
              title={item.name}
              active={this.props.program==item.id}
              onPress={() => this.props.setProgram('zynaddsubfx', item.id)}
            />
          )}
        />
        </ScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  main: {
    marginBottom: 46
  }
});

const mapStateToProps = (state, prop) => {
  return {
    programs: state.modules.zynaddsubfx.programs,
    program: state.modules.zynaddsubfx.program,
    controls: state.modules.zynaddsubfx.controls,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SynthScreen)
