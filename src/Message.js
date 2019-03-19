import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

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

//flex: 1,
//flexDirection: 'row',
//justifyContent: 'space-between',

export default Message;
