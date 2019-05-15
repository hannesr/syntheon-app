import React from 'react';
import {TouchableHighlight, View, Text, Switch, StyleSheet} from 'react-native';

class BigSlider extends React.Component {

  constructor(props) {
    super(props);
    this.timestamp = new Date();
  }

  render() {
    return (
      <View style={styles.frame}>
        <Text style={styles.label}>{this.props.label}</Text>
        <Switch style={styles.switch}
          value={this.props.value}
          thumbColor='#2196F3' trackColor='#c8deef'
          onValueChange={this.props.onChanged}
        />
      </View>
    );
  }

  onChanged(value, complete=false) {
    const ts = new Date();
    if (ts - this.timestamp > 150 || complete) {
      this.timestamp = ts;
      this.props.onChanged(value);
    }
  }
}

const styles = StyleSheet.create({
  frame: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center'
  },
  label: {
    marginLeft: 16,
  },
  switch: {
    marginLeft: 4,
  }
});

export default BigSlider;
