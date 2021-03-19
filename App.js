import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import {useGlobal} from 'reactn';
import {showOverlay} from './src/navigation/functions';
import {navStart, setMain, setRoot} from './src/navigation/navStart';
import {
  getLanguage,
  getToken,
  getUser,
  storeUser,
} from './src/shared/asyncStorage';
import {webSocket} from './src/sockets';

export default function App() {
  const setToken = useGlobal('token')[1];
  const setUser = useGlobal('user')[1];
  const setLanguage = useGlobal('language')[1];
  const setIsAdmin = useGlobal('isAdmin')[1];

  React.useEffect(() => {
    webSocket.init();
    handleOnMessage();
    handleGetToken();
  }, []);

  const handleOnMessage = () => {
    webSocket.socket.on('message', (data) => {
      showOverlay('CustomAlert', {
        alert: {
          title: data.title,
          description: data.description,
        },
      });
    });
  };

  const handleGetToken = async () => {
    const asyncToken = await getToken();
    console.log('asyncToken', asyncToken);
    const asyncLang = await getLanguage();
    setLanguage(asyncLang);
    setToken(asyncToken);
    if (asyncToken) {
      const user = await getUser();
      setMain(user.phoneNumber);
      SplashScreen.hide();
      setUser(user);
      // if (user.phoneNumber === '+918433802669') setIsAdmin(true);
      if (user.phoneNumber === '+593983873813') setIsAdmin(true);
      if (user) {
        const response = await webSocket.getUserByToken(asyncToken);
        if (!response.err) {
          // if (response.user.phoneNumber === '+918433802669') setIsAdmin(true);
          if (response.user.phoneNumber === '+593983873813') setIsAdmin(true);
          setUser(response.user);
          storeUser(response.user);
        }
      }
    } else {
      setRoot();
      SplashScreen.hide();
    }
  };

  return <></>;
}

async function start() {
  navStart();
}

export {start};
