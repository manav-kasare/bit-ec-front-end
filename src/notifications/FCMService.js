import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {sendNotification} from './index';
import {webSocket} from '../sockets';

class FCMService {
  register = (onOpenNotification) => {
    this.checkPermission();
    this.createNotificationListeners(onOpenNotification);
    this.tokenRefresh;
    messaging().onMessageSent((evt) => {});
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    if (!enabled) {
      this.requestPermission();
    }
  };

  requestPermission = async () => {
    await messaging().requestPermission();
  };

  checkToken = async (token, notifID, setUser) => {
    const fcmToken = await messaging().getToken();
    if (fcmToken && fcmToken !== notifID) {
      const response = await webSocket.updateUser(token, {
        notificationId: fcmToken,
      });
      setUser(response.user);
    }
    this.tokenRefresh(token);
  };

  tokenRefresh = async (token) => {
    messaging().onTokenRefresh(async (fcmToken) => {
      await webSocket.updateUser(token, {notificationId: fcmToken});
    });
  };

  deleteToken = () => {
    messaging()
      .deleteToken()
      .catch((error) => {});
  };

  createNotificationListeners = (onOpenNotification) => {
    // When the application is running, but in the background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage) {
        const notification = remoteMessage;
        onOpenNotification(notification);
        this.removeDeliveredNotification(notification.notificationId);
      }
    });

    // When the application is opened from a quit state.
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          const notification = remoteMessage;
          onOpenNotification(notification);
          //  this.removeDeliveredNotification(notification.notificationId)
        }
      });
  };

  // sendMessage = ({title, body, to, data}) => {
  //   try {
  //     messaging().sendMessage({
  //       notification: {
  //         title: title,
  //         body: body,
  //         vibrate: 1,
  //         sound: 1,
  //         badge: 1,
  //       },
  //       messageId: 'slkfjklsjflksd',
  //       messageType: 'slkfjlksajflksjf',
  //       to: to + '@fcm.googleapis.com',
  //       data,
  //       content_available: true,
  //     });
  //   } catch (err) {
  //     console.log('error', err);
  //   }
  // };

  // // Foreground state messages
  messageListener = (onMessageCallback) => {
    messaging().onMessage(() => onMessageCallback);
  };

  sendNotification = (data, regIds, title, body) => {
    const FIREBASE_API_KEY =
      'AAAApRq1jDQ:APA91bHNVTwd-BQsKBTimoT6OJ-SvDn31hme2TNoycD9XnuyaaelQnAsyX9rLOvHM58TFsrTk64Pz4cYPNcaY73SNLYp-wMJz6smhyn-zlDqo3ezqR7Iuk90zUx0oImsPTCjDe28BLFX';
    const message = {
      registration_ids: regIds,
      notification: {
        title: title,
        body: body,
        vibrate: 1,
        sound: 1,
        badge: 1,
        show_in_foreground: false,
        priority: 'high',
        content_available: true,
      },
      data: data,
    };

    sendNotification(message, FIREBASE_API_KEY);
  };

  unRegister = () => {
    this.messageListener();
  };
}

export const fcmService = new FCMService();
