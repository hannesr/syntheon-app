import React from 'react';
import {TouchableHighlight, View, Text, StyleSheet} from 'react-native';

class BigButton extends React.Component {

  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        underlayColor="white">
        <View style={[styles.button, this.props.active && styles.active]}>
          <Text style={styles.text}>{this.props.title}</Text>
        </View>
      </TouchableHighlight>
    );
  }

}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    marginTop: 16,
    marginLeft: 30,
    marginRight: 30,
    alignItems: 'center',
    backgroundColor: '#2196F3'
  },
  active: {
    backgroundColor: '#145f9a'
  },
  text: {
    fontSize: 18,
    padding: 16,
    color: 'white'
  }
});

export default BigButton;
