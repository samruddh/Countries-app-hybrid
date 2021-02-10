import React, { BackHandler } from 'react-native';
import { View, StyleSheet, Button, Alert } from "react-native";

export default Exit =()=>{

    Alert.alert(
        'Exit App',
        'Do you want to exit?',
        [
          {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'Yes', onPress: () => BackHandler.exitApp()},
        ],
        { cancelable: false });
        return true;

}