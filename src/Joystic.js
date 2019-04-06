import React from 'react';
import {TouchableHighlight, View, Text, StyleSheet} from 'react-native';

class Joystic extends React.Component {

  constructor(props) {
    super(props);
    this.state = {active: false, max: 400, x: 200, y: 200};
  }

  render() {
    return (
      <View onLayout={(e) => this.onSize(e)}
        style={[styles.joystic, this.state.active && styles.active, {height: this.state.max, borderRadius: this.state.max/2}]}
        pointerEvents='box-only'
        onStartShouldSetResponder={(e) => true}
        onResponderGrant={(e) => {this.onThumb(true, e)}}
        onResponderMove={(e) => {this.onThumb(null, e)}}
        onResponderRelease={(e) => {this.onThumb(false, e)}}
      >
        <View style={[styles.thumb, {left: this.state.x-20, top: this.state.y-20}]} />
      </View>
    );
  }

  onSize(e) {
    const {x, y, height, width} = e.nativeEvent.layout;
    this.setState({max: width, x: width/2, y: width/2});
  }

  onThumb(mode, e) {
    let {locationX, locationY} = e.nativeEvent;
    if (mode===true) this.setState({active: true});
    if (mode===false) this.setState({active: false});
    if (locationX<0) locationX = 0;
    if (locationX>this.state.max) locationX = this.state.max;
    if (locationY<0) locationY = 0;
    if (locationY>this.state.max) locationY = this.state.max;
    this.setState({x: locationX, y: locationY});
    this.props.onValueChanged(100*locationX/this.state.max, 100*locationY/this.state.max);
  }
}

const styles = StyleSheet.create({
  joystic: {
    height: 200,
    borderRadius: 100,
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: '#2196F3'
  },
  active: {
    opacity: 0.75
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    left: 50, top: 50,
    backgroundColor: '#145f9a'
  }
});

export default Joystic;
