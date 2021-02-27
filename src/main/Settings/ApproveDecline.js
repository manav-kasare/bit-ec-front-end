import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {List} from 'react-native-paper';
import {webSocket} from '../../sockets';
import {fcmService} from '../../notifications/FCMService';

export default function ApproveDecline({id, componentId, type}) {
  const handleApprove = async () => {
    if (type === 'transaction') {
      const response = await webSocket.approveTransaction(id);
      if (!response.err) {
        const someUser = await webSocket.getUserById(
          response.transaction.userId,
        );
        fcmService.sendNotification(
          {},
          [someUser.notificationId],
          `Your buy transaction of ${
            response.transaction.amount / response.transaction.atPrice
          } has been approved`,
          '',
        );
      }
    } else if (type === 'trade') {
      const response = await webSocket.approveTrade(id);
      if (!response.err) {
        if (response.trade.type === 'buy') {
          const creator = await webSocket.getUserById(response.trade.creator);
          fcmService.sendNotification(
            {},
            [creator.notificationId],
            `Your buy trade of ${
              response.trade.amount / response.trade.atPrice
            } has been approved`,
            '',
          );
          const trader = await webSocket.getUserById(response.trade.trader);
          fcmService.sendNotification(
            {},
            [trader.notificationId],
            `Your sell trade of ${
              response.trade.amount / response.trade.atPrice
            } has been approved`,
            '',
          );
        } else if (response.trade.type === 'sell') {
          const creator = await webSocket.getUserById(response.trade.creator);
          fcmService.sendNotification(
            {},
            [creator.notificationId],
            `Your sell trade of ${
              response.trade.amount / response.trade.atPrice
            } has been approved`,
            '',
          );
          const trader = await webSocket.getUserById(response.trade.trader);
          fcmService.sendNotification(
            {},
            [trader.notificationId],
            `Your buy trade of ${
              response.trade.amount / response.trade.atPrice
            } has been approved`,
            '',
          );
        }
      }
    }
    Navigation.dismissOverlay(componentId);
  };

  const handleDecline = async () => {
    if (type === 'transaction') {
      const response = await webSocket.declineTransaction(id);
      if (!response.err) {
        const someUser = await webSocket.getUserById(
          response.transaction.userId,
        );
        fcmService.sendNotification(
          {},
          [someUser.notificationId],
          `Your buy transaction of ${
            response.transaction.amount / response.transaction.atPrice
          } has been declined`,
          '',
        );
      }
    } else if (type === 'trade') {
      const response = await webSocket.declineTrade(id);
      if (!response.err) {
        if (response.trade.type === 'buy') {
          const creator = await webSocket.getUserById(response.trade.creator);
          fcmService.sendNotification(
            {},
            [creator.notificationId],
            `Your buy trade of ${
              response.trade.amount / response.trade.atPrice
            } has been declined`,
            '',
          );
          const trader = await webSocket.getUserById(response.trade.trader);
          fcmService.sendNotification(
            {},
            [trader.notificationId],
            `Your sell trade of ${
              response.trade.amount / response.trade.atPrice
            } has been declined`,
            '',
          );
        } else if (response.trade.type === 'sell') {
          const creator = await webSocket.getUserById(response.trade.creator);
          fcmService.sendNotification(
            {},
            [creator.notificationId],
            `Your sell trade of ${
              response.trade.amount / response.trade.atPrice
            } has been declined`,
            '',
          );
          const trader = await webSocket.getUserById(response.trade.trader);
          fcmService.sendNotification(
            {},
            [trader.notificationId],
            `Your buy trade of ${
              response.trade.amount / response.trade.atPrice
            } has been declined`,
            '',
          );
        }
      }
    }
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
