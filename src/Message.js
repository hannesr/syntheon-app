import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import { connect } from 'react-redux'

class Message extends React.Component {

  render() {
    return (
      <View style={styles.box}>
        <Text style={styles.text}>
          {this.props.text}
        </Text>
        {this.props.spinner &&
          <ActivityIndicator size="small" color="#0000ff" />
        }
      </View>
    );
  }

}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#c8deef',
    flexDirection: 'row'
  },
  text: {
    padding: 5
  }
});

const mapStateToProps = (state, prop) => {
  return {
    text: state.message,
    spinner: state.spinner
  }
}

export default connect(mapStateToProps)(Message)
