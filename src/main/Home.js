import React from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';

export default function Home() {
  return <SafeAreaView style={styles.screen}></SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: {
    width: constants.width,
    height: constants.height,
    backgroundColor: 'white',
    justifyContent: 'space-around',
  },
});
