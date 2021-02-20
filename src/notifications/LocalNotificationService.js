import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {getUser} from '../realm/Router';

class LocalNotificationService {
  configure = (onOpenNotification) => {
    PushNotification.configure({
      onRegister: function () {},
      onNotification: function (notification) {
        notification.userInteraction = true;
        if (notification.data.item) {
          onOpenNotification(notification.data.item);
        } else {
          onOpenNotification({url: notification.data.url});
        }

        if (Platform.OS === 'ios') {
          // (required) Called when a remote is received or opened, or local notification is opened
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  unregister = () => {
    PushNotification.unregister();
  };

  showNotification = async (id, title, message, data, token, options = {}) => {
    const user = await getUser();
    if (data.type === 'joinConversation') {
      if (user.mutedRoom.indexOf(data._id) === -1) {
        PushNotification.localNotification({
          ...(Platform.OS === 'android'
            ? this.buildAndroidNotification
            : this.buildIOSNotification),
          title: title,
          message: message,
        });
      }
    }
  };

  scheduleNotification = (id, title, message, data, token, options = {}) => {
    PushNotification.scheduleLocalNotification({
      ...(Platform.OS === 'android'
        ? this.buildAndroidNotification
        : this.buildIOSNotification),
      date: data.date,
      title: title,
      message: message,
      priority: 'high',
    });
  };

  buildAndroidNotification = (id, title, message, data, options = {}) => {
    return {
      id: id,
      autoCancel: true,
      largeIcon: 'logo',
      smallIcon: 'logo',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance || 'high',
      data: data,
    };
  };

  buildIOSNotification = (id, title, message, data, options = {}) => {
    return {
      alertAction: options.alertAction || 'view',
      category: options.category || '',
      userInfo: {
        id: id,
        item: data,
      },
    };
  };

  cancelAllLocalNotifications = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  removeDeliveredNotificationByID = (notificationId) => {
    PushNotification.cancelLocalNotifications({id: `${notificationId}`});
  };
}

export const localNotificationService = new LocalNotificationService();
