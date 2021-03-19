import './src/shared/constants';
import './src/shared/localization';
import {start} from './App';
import messaging from '@react-native-firebase/messaging';
import {AppState, Platform} from 'react-native';
import {getUser, storeUser} from './src/shared/asyncStorage';
import {webSocket} from './src/sockets';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  handleNetworkCalls();
});

const handleNetworkCalls = async () => {
  const user = await getUser();
  webSocket.init();
  const response = await webSocket.getUserById(user._id);
  if (!response.err) storeUser(response.user);
};

const checkIsHeadless = () => {
  if (Platform.OS === 'ios') {
    messaging()
      .getIsHeadless()
      .then((isHeadless) => {
        if (isHeadless) {
          handleNetworkCalls();
        } else {
          if (AppState.currentState !== 'background') {
            start();
          }
        }
      });
  } else {
    start();
  }
};

checkIsHeadless();
