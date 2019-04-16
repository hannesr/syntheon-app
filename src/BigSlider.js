import React from 'react';
import {TouchableHighlight, View, Text, Slider, StyleSheet} from 'react-native';

class BigSlider extends React.Component {

  constructor(props) {
    super(props);
    this.timestamp = new Date();
  }

  render() {
    return (
      <View style={styles.sliderframe}>
        <Text style={styles.slidertext}>{this.props.title}</Text>
        <Slider
          minimumValue={this.props.minimumValue || 0}
          maximumValue={this.props.maximumValue || 100}
          step={this.props.step || 1}
          value={this.props.value || 50}
          minimumTrackTintColor='#2196F3'
          maximumTrackTintColor='#c8deef'
          thumbTintColor='#145f9a'
          onValueChange={(value) => this.onChanged(value)}
          onSlidingComplete={(value) => this.onChanged(value, true)}
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
  sliderframe: {
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8
  },
  slidertext: {
    marginLeft: 8,
    color: '#145f9a'
  }
});

export default BigSlider;
