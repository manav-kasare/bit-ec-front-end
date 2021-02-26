import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import {useGlobal} from 'reactn';
import {navStart, setMain, setRoot} from './src/navigation/navStart';
import {getToken, getUser, storeUser} from './src/shared/asyncStorage';
import {webSocket} from './src/sockets';

export default function App() {
  const setToken = useGlobal('token')[1];
  const setUser = useGlobal('user')[1];
  const setIsAdmin = useGlobal('isAdmin')[1];

  React.useEffect(() => {
    webSocket.init();
    handleGetToken();
  }, []);

  const handleGetToken = async () => {
    const asyncToken = await getToken();
    setToken(asyncToken);
    if (asyncToken) {
      const user = await getUser();
      console.log('user', user);
      setMain(user.phoneNumber);
      SplashScreen.hide();
      setUser(user);
      if (user.phoneNumber === '+918433802669') setIsAdmin(true);
      // if (user.phoneNumber === '+593983873813') setIsAdmin(true);
      if (user) {
        const response = await webSocket.getUserByToken(asyncToken);
        console.log('response', response);
        if (!response.err) {
          if (response.user.phoneNumber === '+918433802669') setIsAdmin(true);
          // if (response.user.phoneNumber === '+593983873813') setIsAdmin(true);
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
