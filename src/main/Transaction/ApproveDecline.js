import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {List} from 'react-native-paper';
import {webSocket} from '../../sockets';

export default function ApproveDecline({
  transactionId,
  componentId,
  setTransaction,
}) {
  const handleApprove = async () => {
    const transaction = await webSocket.approve(transactionId);
    setTransaction(transaction);
    Navigation.dismissOverlay(componentId);
  };

  const handleDecline = async () => {
    const transaction = await webSocket.decline(transactionId);
    setTransaction(transaction);
    Navigation.dismissOverlay(componentId);
  };

  return (
    <View style={styles.modal}>
      <List.Item
        style={styles.tile}
        title="Approve"
        titleStyle={styles.titleStyle}
        onPress={handleApprove}
      />
      <View style={styles.seperator} />
      <List.Item
        style={styles.tile}
        title="Decline"
        titleStyle={[styles.titleStyle, {color: 'crimson'}]}
        onPress={handleDecline}
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
