import React, {Component} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';

const logo = require('./logo.png')

export default class Splash extends Component {
  async componentDidMount() {
    // You can load api data or any other thing here
    const data = await this.navigateToHome();
    if (data !== null) {
      this.props.navigation.navigate('Home');
    }
  }

  navigateToHome = async () => {
  // Splash screen will remain visible for 2 seconds
  const wait = time => new Promise((resolve) => setTimeout(resolve, time));
  return wait(1500).then(() => this.props.navigation.navigate('Home'))
  
  };

  

  render() {
    return(
      <View style={styles.container}>
        <Image source={logo}
          style={{height:100,width:100}}>
        </Image>
      </View>
    );
  
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#307ecc',
  },
});
