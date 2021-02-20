import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {List} from 'react-native-paper';

export default function ApproveDecline() {
  return (
    <View style={styles.modal}>
      <List.Item
        style={styles.tile}
        title="Approve"
        titleStyle={styles.titleStyle}
      />
      <View style={styles.seperator} />
      <List.Item
        style={styles.tile}
        title="Decline"
        titleStyle={[styles.titleStyle, {color: 'crimson'}]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: constants.width,
    height: constants.height * 0.25,
    backgroundColor: constants.primary,
  },
  seperator: {
    height: 0.3,
    width: constants.width * 0.95,
    position: 'relative',
    left: constants.width * 0.05,
    backgroundColor: 'grey',
  },
  tile: {
    height: constants.height * 0.1,
    width: constants.width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStyle: {
    color: 'white',
    fontSize: 25,
    fontWeight: '700',
  },
});
