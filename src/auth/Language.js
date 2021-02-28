import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

export default function Language() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.heading}></Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: constants.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: 'white',
    fontSize: 25,
    fontWeight: '800',
  },
});
